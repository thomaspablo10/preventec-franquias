from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.franchise import FranchiseRead
from app.models.ticket import TicketPriority, TicketStatus
from app.models.franchise import FranchiseStatus
from app.models.document import DocumentScope


class DashboardRecentFranchiseItem(BaseModel):
    id: int
    trade_name: str
    city: str
    state: str
    status: FranchiseStatus
    contact_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardRecentTicketItem(BaseModel):
    id: int
    subject: str
    status: TicketStatus
    priority: TicketPriority
    franchise_id: int
    franchise_name: str
    last_message: str | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardRecentDocumentItem(BaseModel):
    id: int
    title: str
    category: str | None = None
    scope: DocumentScope
    franchise_id: int | None = None
    franchise_name: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminDashboardStats(BaseModel):
    total_franchises: int
    active_franchises: int
    pending_franchises: int
    inactive_franchises: int
    total_franchisees: int
    active_franchisees: int
    total_documents: int
    active_documents: int
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    unread_tickets: int


class AdminDashboardResponse(BaseModel):
    stats: AdminDashboardStats
    recent_franchises: list[DashboardRecentFranchiseItem]
    recent_tickets: list[DashboardRecentTicketItem]
    recent_documents: list[DashboardRecentDocumentItem]


class PortalDashboardStats(BaseModel):
    available_documents: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    unread_tickets: int


class PortalDashboardResponse(BaseModel):
    franchise: FranchiseRead
    stats: PortalDashboardStats
    recent_tickets: list[DashboardRecentTicketItem]
    recent_documents: list[DashboardRecentDocumentItem]