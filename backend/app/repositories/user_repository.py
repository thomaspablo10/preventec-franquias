import re

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.franchise import Franchise
from app.models.user import User
from app.schemas.user import UserCreate

FRANCHISOR_ACCESS_CODE = "26000001"


def normalize_access_code(access_code: str) -> str:
    return access_code.strip().upper()


def normalize_username(username: str) -> str:
    return username.strip().lower()


def build_base_username(*parts: str | None) -> str:
    for raw_part in parts:
        if not raw_part:
            continue
        cleaned = re.sub(r"[^a-z0-9]+", "", raw_part.lower())
        if cleaned:
            return cleaned[:50]
    return "usuario"


def get_user_by_access_code_and_username(
    db: Session,
    access_code: str,
    username: str,
) -> User | None:
    return (
        db.query(User)
        .filter(
            func.upper(User.access_code) == normalize_access_code(access_code),
            func.lower(User.username) == normalize_username(username),
        )
        .first()
    )


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def username_exists(db: Session, access_code: str, username: str) -> bool:
    return get_user_by_access_code_and_username(db, access_code, username) is not None


def generate_unique_username(db: Session, access_code: str, preferred_username: str) -> str:
    normalized_access_code = normalize_access_code(access_code)
    base_username = build_base_username(preferred_username)

    if not username_exists(db, normalized_access_code, base_username):
        return base_username

    suffix = 2
    while True:
        candidate = f"{base_username[:44]}{suffix}"
        if not username_exists(db, normalized_access_code, candidate):
            return candidate
        suffix += 1


def resolve_access_code(db: Session, user_in: UserCreate) -> str:
    if user_in.access_code:
        return normalize_access_code(user_in.access_code)

    if user_in.franchise_id:
        franchise = db.query(Franchise).filter(Franchise.id == user_in.franchise_id).first()
        if franchise:
            return normalize_access_code(franchise.franchise_code)

    return FRANCHISOR_ACCESS_CODE


def create_user(db: Session, user_in: UserCreate) -> User:
    access_code = resolve_access_code(db, user_in)

    preferred_username = user_in.username or user_in.email or user_in.full_name or "usuario"
    username = generate_unique_username(db, access_code, preferred_username)

    full_name = (user_in.full_name or username).strip()

    user = User(
        access_code=access_code,
        username=username,
        full_name=full_name,
        email=str(user_in.email).lower().strip() if user_in.email else None,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        franchise_id=user_in.franchise_id,
        is_primary=user_in.is_primary,
        first_login_completed=False,
        must_change_password=True,
        must_complete_profile=True,
        is_active=user_in.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user