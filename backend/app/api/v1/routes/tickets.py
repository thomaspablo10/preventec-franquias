from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ticket import (
    TicketConversationItem,
    TicketCreate,
    TicketMessageCreate,
    TicketRead,
    TicketStatusUpdate,
)
from app.services.ticket_service import (
    change_ticket_status,
    create_new_ticket,
    get_ticket_conversations_for_current_user,
    get_ticket_or_none,
    mark_conversation_as_read,
    reply_to_ticket,
)


router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("", response_model=list[TicketConversationItem])
def list_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_ticket_conversations_for_current_user(db=db, user=current_user)


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_or_none(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket não encontrado.",
        )

    if current_user.role != "admin" and current_user.franchise_id != ticket.franchise_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )

    return mark_conversation_as_read(db=db, ticket=ticket, user=current_user)


@router.post("", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_new_ticket(db=db, user=current_user, payload=payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post("/{ticket_id}/messages", response_model=TicketRead)
def add_message(
    ticket_id: int,
    payload: TicketMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_or_none(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket não encontrado.",
        )

    if current_user.role != "admin" and current_user.franchise_id != ticket.franchise_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )

    return reply_to_ticket(
        db=db,
        ticket=ticket,
        user=current_user,
        message=payload.message,
    )


@router.put("/{ticket_id}/status", response_model=TicketRead)
def update_status(
    ticket_id: int,
    payload: TicketStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem alterar o status.",
        )

    ticket = get_ticket_or_none(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket não encontrado.",
        )

    return change_ticket_status(
        db=db,
        ticket=ticket,
        status=payload.status,
    )