from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.franchise import FranchiseStatus


class FranchiseBase(BaseModel):
    corporate_name: str
    trade_name: str
    cnpj: str | None = None
    contact_name: str
    contact_email: EmailStr
    contact_phone: str | None = None
    city: str
    state: str
    status: FranchiseStatus = FranchiseStatus.pending
    join_date: date | None = None
    notes: str | None = None
    is_active: bool = True


class FranchiseCreate(FranchiseBase):
    pass


class FranchiseUpdate(BaseModel):
    corporate_name: str | None = None
    trade_name: str | None = None
    cnpj: str | None = None
    contact_name: str | None = None
    contact_email: EmailStr | None = None
    contact_phone: str | None = None
    city: str | None = None
    state: str | None = None
    status: FranchiseStatus | None = None
    join_date: date | None = None
    notes: str | None = None
    is_active: bool | None = None


class FranchiseRead(FranchiseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)