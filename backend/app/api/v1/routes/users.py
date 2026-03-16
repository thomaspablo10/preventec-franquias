from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.services.user_service import create_new_user, get_all_users


router = APIRouter(prefix="/users", tags=["Users"])


def ensure_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )


@router.get("", response_model=list[UserRead])
def list_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)
    return get_all_users(db=db)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user_route(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    try:
      return create_new_user(db=db, user_in=payload)
    except ValueError as exc:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail=str(exc),
      )