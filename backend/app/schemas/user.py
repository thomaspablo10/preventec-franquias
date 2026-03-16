from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    access_code: str
    username: str
    full_name: str
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    cpf: str | None = None
    birth_date: date | None = None
    gender: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    job_title: str | None = None
    profile_photo_path: str | None = None
    role: UserRole
    franchise_id: int | None = None
    is_primary: bool = False
    first_login_completed: bool = False
    must_change_password: bool = True
    must_complete_profile: bool = True
    is_active: bool = True


class UserCreate(BaseModel):
    access_code: str | None = None
    username: str | None = None
    full_name: str | None = None
    email: EmailStr | None = None
    password: str
    role: UserRole = UserRole.franchisee
    franchise_id: int | None = None
    is_primary: bool = False
    is_active: bool = True


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)