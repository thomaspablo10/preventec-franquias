from datetime import datetime, timezone

from sqlalchemy.orm import Session, joinedload

from app.models.ticket import Ticket, TicketPriority, TicketStatus
from app.models.ticket_message import TicketMessage
from app.models.user import User


def create_ticket(
    db: Session,
    *,
    subject: str,
    description: str,
    priority: TicketPriority,
    franchise_id: int,
    created_by_user_id: int,
) -> Ticket:
    now = datetime.now(timezone.utc)

    ticket = Ticket(
        subject=subject.strip(),
        description=description.strip(),
        priority=priority,
        franchise_id=franchise_id,
        created_by_user_id=created_by_user_id,
        status=TicketStatus.open,
        franchisee_last_read_at=now,
        admin_last_read_at=None,
    )
    db.add(ticket)
    db.flush()

    initial_message = TicketMessage(
        ticket_id=ticket.id,
        user_id=created_by_user_id,
        message=description.strip(),
    )
    db.add(initial_message)

    db.commit()
    return get_ticket_by_id(db, ticket.id)


def list_tickets_for_admin(db: Session) -> list[Ticket]:
    return (
        db.query(Ticket)
        .options(joinedload(Ticket.messages))
        .order_by(Ticket.updated_at.desc())
        .all()
    )


def list_tickets_for_user(db: Session, user: User) -> list[Ticket]:
    query = db.query(Ticket).options(joinedload(Ticket.messages))

    if user.role == "admin":
        return query.order_by(Ticket.updated_at.desc()).all()

    return (
        query.filter(Ticket.franchise_id == user.franchise_id)
        .order_by(Ticket.updated_at.desc())
        .all()
    )


def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket | None:
    return (
        db.query(Ticket)
        .options(joinedload(Ticket.messages))
        .filter(Ticket.id == ticket_id)
        .first()
    )


def add_ticket_message(
    db: Session,
    *,
    ticket: Ticket,
    user: User,
    message: str,
) -> Ticket:
    ticket_message = TicketMessage(
        ticket_id=ticket.id,
        user_id=user.id,
        message=message.strip(),
    )
    db.add(ticket_message)

    if ticket.status == TicketStatus.open:
        ticket.status = TicketStatus.in_progress

    now = datetime.now(timezone.utc)

    if user.role == "admin":
        ticket.admin_last_read_at = now
    else:
        ticket.franchisee_last_read_at = now

    db.commit()
    return get_ticket_by_id(db, ticket.id)


def update_ticket_status(
    db: Session,
    *,
    ticket: Ticket,
    status: TicketStatus,
) -> Ticket:
    ticket.status = status
    db.commit()
    return get_ticket_by_id(db, ticket.id)


def mark_ticket_as_read(
    db: Session,
    *,
    ticket: Ticket,
    user: User,
) -> Ticket:
    now = datetime.now(timezone.utc)

    if user.role == "admin":
        ticket.admin_last_read_at = now
    else:
        ticket.franchisee_last_read_at = now

    db.commit()
    return get_ticket_by_id(db, ticket.id)