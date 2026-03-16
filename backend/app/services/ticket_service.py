from app.models.ticket import Ticket, TicketStatus
from app.models.user import User
from app.repositories.ticket_repository import (
    add_ticket_message,
    create_ticket,
    get_ticket_by_id,
    list_tickets_for_admin,
    list_tickets_for_user,
    mark_ticket_as_read,
    update_ticket_status,
)
from app.schemas.ticket import TicketConversationItem, TicketCreate


def create_new_ticket(db, *, user: User, payload: TicketCreate) -> Ticket:
    if not user.franchise_id:
        raise ValueError("Usuário não está vinculado a nenhuma franquia.")

    return create_ticket(
        db,
        subject=payload.subject,
        description=payload.description,
        priority=payload.priority,
        franchise_id=user.franchise_id,
        created_by_user_id=user.id,
    )


def _build_conversation_items(tickets: list[Ticket], user: User) -> list[TicketConversationItem]:
    items: list[TicketConversationItem] = []

    for ticket in tickets:
        last_message = ticket.messages[-1] if ticket.messages else None

        if user.role == "admin":
            reference = ticket.admin_last_read_at
            unread_count = sum(
                1
                for msg in ticket.messages
                if msg.user_id != user.id and (reference is None or msg.created_at > reference)
            )
        else:
            reference = ticket.franchisee_last_read_at
            unread_count = sum(
                1
                for msg in ticket.messages
                if msg.user_id != user.id and (reference is None or msg.created_at > reference)
            )

        items.append(
            TicketConversationItem(
                id=ticket.id,
                subject=ticket.subject,
                status=ticket.status,
                priority=ticket.priority,
                franchise_id=ticket.franchise_id,
                created_by_user_id=ticket.created_by_user_id,
                last_message=last_message.message if last_message else None,
                last_message_at=last_message.created_at if last_message else None,
                unread_count=unread_count,
                created_at=ticket.created_at,
                updated_at=ticket.updated_at,
            )
        )

    return items


def get_tickets_for_current_user(db, user: User) -> list[Ticket]:
    if user.role == "admin":
        return list_tickets_for_admin(db)
    return list_tickets_for_user(db, user)


def get_ticket_conversations_for_current_user(db, user: User) -> list[TicketConversationItem]:
    tickets = get_tickets_for_current_user(db, user)
    return _build_conversation_items(tickets, user)


def get_ticket_or_none(db, ticket_id: int) -> Ticket | None:
    return get_ticket_by_id(db, ticket_id)


def reply_to_ticket(db, *, ticket: Ticket, user: User, message: str) -> Ticket:
    return add_ticket_message(
        db,
        ticket=ticket,
        user=user,
        message=message,
    )


def change_ticket_status(db, *, ticket: Ticket, status: TicketStatus) -> Ticket:
    return update_ticket_status(db, ticket=ticket, status=status)


def mark_conversation_as_read(db, *, ticket: Ticket, user: User) -> Ticket:
    return mark_ticket_as_read(db, ticket=ticket, user=user)