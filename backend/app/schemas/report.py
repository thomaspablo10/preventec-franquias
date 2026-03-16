from datetime import datetime
from pydantic import BaseModel
from app.models.ticket import TicketStatus, TicketPriority
from app.models.franchise import FranchiseStatus
from app.models.document import DocumentScope


class FranchiseReportItem(BaseModel):
    id: int
    trade_name: str
    city: str
    state: str
    status: FranchiseStatus
    contact_name: str
    created_at: datetime


class TicketReportItem(BaseModel):
    id: int
    subject: str
    franchise_name: str
    status: TicketStatus
    priority: TicketPriority
    created_at: datetime
    updated_at: datetime


class DocumentReportItem(BaseModel):
    id: int
    title: str
    category: str | None
    scope: DocumentScope
    franchise_name: str | None
    created_at: datetime