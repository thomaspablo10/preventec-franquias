from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.models.user import User
from app.repositories.dashboard_repository import (
    get_admin_dashboard_counts,
    get_portal_franchise_document_count,
    get_portal_ticket_counts,
    list_recent_documents_admin,
    list_recent_documents_for_franchise,
    list_recent_franchises,
    list_recent_tickets_admin,
    list_recent_tickets_for_franchise,
)
from app.schemas.dashboard import (
    AdminDashboardResponse,
    AdminDashboardStats,
    DashboardRecentDocumentItem,
    DashboardRecentFranchiseItem,
    DashboardRecentTicketItem,
    PortalDashboardResponse,
    PortalDashboardStats,
)
from app.services.franchise_service import get_franchise_or_none


def _build_ticket_item(ticket: Ticket, current_user: User, franchise_name: str) -> DashboardRecentTicketItem:
    last_message = ticket.messages[-1] if ticket.messages else None

    if current_user.role == "admin":
        reference = ticket.admin_last_read_at
    else:
        reference = ticket.franchisee_last_read_at

    unread_count = sum(
        1
        for msg in ticket.messages
        if msg.user_id != current_user.id and (reference is None or msg.created_at > reference)
    )

    return DashboardRecentTicketItem(
        id=ticket.id,
        subject=ticket.subject,
        status=ticket.status,
        priority=ticket.priority,
        franchise_id=ticket.franchise_id,
        franchise_name=franchise_name,
        last_message=last_message.message if last_message else None,
        last_message_at=last_message.created_at if last_message else None,
        unread_count=unread_count,
        updated_at=ticket.updated_at,
    )


def get_admin_dashboard_data(db: Session, current_user: User) -> AdminDashboardResponse:
    counts = get_admin_dashboard_counts(db)
    recent_franchises = list_recent_franchises(db, limit=5)
    recent_tickets = list_recent_tickets_admin(db, limit=5)
    recent_documents = list_recent_documents_admin(db, limit=5)

    franchise_name_map = {item.id: item.trade_name for item in recent_franchises}

    for ticket in recent_tickets:
        if ticket.franchise_id not in franchise_name_map:
            franchise = get_franchise_or_none(db, ticket.franchise_id)
            franchise_name_map[ticket.franchise_id] = franchise.trade_name if franchise else "Franquia"

    unread_tickets = sum(
        1
        for ticket in recent_tickets
        if any(
            msg.user_id != current_user.id
            and (ticket.admin_last_read_at is None or msg.created_at > ticket.admin_last_read_at)
            for msg in ticket.messages
        )
    )

    stats = AdminDashboardStats(
        **counts,
        unread_tickets=unread_tickets,
    )

    return AdminDashboardResponse(
        stats=stats,
        recent_franchises=[
            DashboardRecentFranchiseItem.model_validate(item) for item in recent_franchises
        ],
        recent_tickets=[
            _build_ticket_item(
                ticket=ticket,
                current_user=current_user,
                franchise_name=franchise_name_map.get(ticket.franchise_id, "Franquia"),
            )
            for ticket in recent_tickets
        ],
        recent_documents=[
            DashboardRecentDocumentItem(
                id=document.id,
                title=document.title,
                category=document.category,
                scope=document.scope,
                franchise_id=document.franchise_id,
                franchise_name=franchise_name,
                created_at=document.created_at,
            )
            for document, franchise_name in recent_documents
        ],
    )


def get_portal_dashboard_data(db: Session, current_user: User) -> PortalDashboardResponse:
    if not current_user.franchise_id:
        raise ValueError("Usuário não está vinculado a nenhuma franquia.")

    franchise = get_franchise_or_none(db, current_user.franchise_id)
    if not franchise:
        raise ValueError("Franquia vinculada não encontrada.")

    document_count = get_portal_franchise_document_count(db, current_user.franchise_id)
    ticket_counts = get_portal_ticket_counts(db, current_user.franchise_id)
    recent_tickets = list_recent_tickets_for_franchise(db, current_user.franchise_id, limit=5)
    recent_documents = list_recent_documents_for_franchise(db, current_user.franchise_id, limit=5)

    unread_tickets = sum(
        1
        for ticket in recent_tickets
        if any(
            msg.user_id != current_user.id
            and (ticket.franchisee_last_read_at is None or msg.created_at > ticket.franchisee_last_read_at)
            for msg in ticket.messages
        )
    )

    stats = PortalDashboardStats(
        available_documents=document_count,
        unread_tickets=unread_tickets,
        **ticket_counts,
    )

    return PortalDashboardResponse(
        franchise=franchise,
        stats=stats,
        recent_tickets=[
            _build_ticket_item(
                ticket=ticket,
                current_user=current_user,
                franchise_name=franchise.trade_name,
            )
            for ticket in recent_tickets
        ],
        recent_documents=[
            DashboardRecentDocumentItem(
                id=document.id,
                title=document.title,
                category=document.category,
                scope=document.scope,
                franchise_id=document.franchise_id,
                franchise_name=franchise_name,
                created_at=document.created_at,
            )
            for document, franchise_name in recent_documents
        ],
    )