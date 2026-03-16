from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.franchise import Franchise
from app.models.ticket import Ticket
from app.models.document import Document
from app.models.franchise import FranchiseStatus
from app.models.ticket import TicketStatus, TicketPriority
from app.models.document import DocumentScope


def get_franchise_report(db: Session):
    return db.query(Franchise).order_by(Franchise.created_at.desc()).all()


def get_ticket_report(db: Session):
    return (
        db.query(Ticket)
        .join(Franchise, Franchise.id == Ticket.franchise_id)
        .add_columns(Franchise.trade_name)
        .order_by(Ticket.created_at.desc())
        .all()
    )


def get_document_report(db: Session):
    return (
        db.query(Document)
        .outerjoin(Franchise, Franchise.id == Document.franchise_id)
        .add_columns(Franchise.trade_name)
        .order_by(Document.created_at.desc())
        .all()
    )