from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.repositories.user_repository import get_user_by_access_code_and_username


def authenticate_user(db: Session, access_code: str, username: str, password: str) -> User | None:
    user = get_user_by_access_code_and_username(db, access_code=access_code, username=username)

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    if not user.is_active:
        return None

    return user


def build_login_response(user: User) -> dict:
    access_token = create_access_token(subject=user.id)
    profile_completion_required = user.must_change_password or user.must_complete_profile

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "profile_completion_required": profile_completion_required,
        "user": user,
    }