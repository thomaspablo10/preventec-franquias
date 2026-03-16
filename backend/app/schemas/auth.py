from pydantic import BaseModel

from app.schemas.user import UserRead


class LoginRequest(BaseModel):
    access_code: str
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    profile_completion_required: bool
    user: UserRead