from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.document import Document, DocumentScope
from app.models.franchise import Franchise, FranchiseStatus
from app.models.ticket import Ticket, TicketStatus
from app.models.user import User, UserRole


def get_admin_dashboard_counts(db: Session) -> dict:
    total_franchises = db.query(func.count(Franchise.id)).scalar() or 0
    active_franchises = (
        db.query(func.count(Franchise.id))
        .filter(Franchise.status == FranchiseStatus.active)
        .scalar()
        or 0
    )
    pending_franchises = (
        db.query(func.count(Franchise.id))
        .filter(Franchise.status == FranchiseStatus.pending)
        .scalar()
        or 0
    )
    inactive_franchises = (
        db.query(func.count(Franchise.id))
        .filter(Franchise.status == FranchiseStatus.inactive)
        .scalar()
        or 0
    )

    total_franchisees = (
        db.query(func.count(User.id))
        .filter(User.role == UserRole.franchisee)
        .scalar()
        or 0
    )
    active_franchisees = (
        db.query(func.count(User.id))
        .filter(User.role == UserRole.franchisee, User.is_active == True)  # noqa: E712
        .scalar()
        or 0
    )

    total_documents = db.query(func.count(Document.id)).scalar() or 0
    active_documents = (
        db.query(func.count(Document.id))
        .filter(Document.is_active == True)  # noqa: E712
        .scalar()
        or 0
    )

    total_tickets = db.query(func.count(Ticket.id)).scalar() or 0
    open_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == TicketStatus.open)
        .scalar()
        or 0
    )
    in_progress_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == TicketStatus.in_progress)
        .scalar()
        or 0
    )
    resolved_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == TicketStatus.resolved)
        .scalar()
        or 0
    )
    closed_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == TicketStatus.closed)
        .scalar()
        or 0
    )

    return {
        "total_franchises": total_franchises,
        "active_franchises": active_franchises,
        "pending_franchises": pending_franchises,
        "inactive_franchises": inactive_franchises,
        "total_franchisees": total_franchisees,
        "active_franchisees": active_franchisees,
        "total_documents": total_documents,
        "active_documents": active_documents,
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "resolved_tickets": resolved_tickets,
        "closed_tickets": closed_tickets,
    }


def list_recent_franchises(db: Session, limit: int = 5) -> list[Franchise]:
    return (
        db.query(Franchise)
        .order_by(Franchise.created_at.desc())
        .limit(limit)
        .all()
    )


def list_recent_tickets_admin(db: Session, limit: int = 5) -> list[Ticket]:
    return (
        db.query(Ticket)
        .options(joinedload(Ticket.messages))
        .order_by(Ticket.updated_at.desc())
        .limit(limit)
        .all()
    )


def list_recent_documents_admin(db: Session, limit: int = 5) -> list[tuple[Document, str | None]]:
    rows = (
        db.query(Document, Franchise.trade_name)
        .outerjoin(Franchise, Franchise.id == Document.franchise_id)
        .order_by(Document.created_at.desc())
        .limit(limit)
        .all()
    )
    return rows


def get_portal_franchise_document_count(db: Session, franchise_id: int) -> int:
    return (
        db.query(func.count(Document.id))
        .filter(
            Document.is_active == True,  # noqa: E712
            or_(
                Document.scope == DocumentScope.global_,
                Document.franchise_id == franchise_id,
            ),
        )
        .scalar()
        or 0
    )


def get_portal_ticket_counts(db: Session, franchise_id: int) -> dict:
    open_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.franchise_id == franchise_id, Ticket.status == TicketStatus.open)
        .scalar()
        or 0
    )
    in_progress_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.franchise_id == franchise_id, Ticket.status == TicketStatus.in_progress)
        .scalar()
        or 0
    )
    resolved_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.franchise_id == franchise_id, Ticket.status == TicketStatus.resolved)
        .scalar()
        or 0
    )
    closed_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.franchise_id == franchise_id, Ticket.status == TicketStatus.closed)
        .scalar()
        or 0
    )

    return {
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "resolved_tickets": resolved_tickets,
        "closed_tickets": closed_tickets,
    }


def list_recent_tickets_for_franchise(
    db: Session,
    franchise_id: int,
    limit: int = 5,
) -> list[Ticket]:
    return (
        db.query(Ticket)
        .options(joinedload(Ticket.messages))
        .filter(Ticket.franchise_id == franchise_id)
        .order_by(Ticket.updated_at.desc())
        .limit(limit)
        .all()
    )


def list_recent_documents_for_franchise(
    db: Session,
    franchise_id: int,
    limit: int = 5,
) -> list[tuple[Document, str | None]]:
    rows = (
        db.query(Document, Franchise.trade_name)
        .outerjoin(Franchise, Franchise.id == Document.franchise_id)
        .filter(
            Document.is_active == True,  # noqa: E712
            or_(
                Document.scope == DocumentScope.global_,
                Document.franchise_id == franchise_id,
            ),
        )
        .order_by(Document.created_at.desc())
        .limit(limit)
        .all()
    )
    return rows