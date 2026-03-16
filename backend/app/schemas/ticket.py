from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.ticket import TicketPriority, TicketStatus


class TicketMessageCreate(BaseModel):
    message: str


class TicketMessageRead(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketCreate(BaseModel):
    subject: str
    description: str
    priority: TicketPriority = TicketPriority.medium


class TicketStatusUpdate(BaseModel):
    status: TicketStatus


class TicketRead(BaseModel):
    id: int
    subject: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    franchise_id: int
    created_by_user_id: int
    franchisee_last_read_at: datetime | None = None
    admin_last_read_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    messages: list[TicketMessageRead] = []

    model_config = ConfigDict(from_attributes=True)


class TicketConversationItem(BaseModel):
    id: int
    subject: str
    status: TicketStatus
    priority: TicketPriority
    franchise_id: int
    created_by_user_id: int
    last_message: str | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)