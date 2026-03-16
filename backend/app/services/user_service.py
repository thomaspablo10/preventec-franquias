from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import create_user, list_users
from app.schemas.user import UserCreate


def get_all_users(db: Session) -> list[User]:
    return list_users(db=db)


def create_new_user(db: Session, user_in: UserCreate) -> User:
    return create_user(db=db, user_in=user_in)