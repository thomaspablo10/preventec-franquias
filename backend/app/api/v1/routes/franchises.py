from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.franchise import FranchiseStatus
from app.models.user import User
from app.schemas.franchise import FranchiseCreate, FranchiseRead, FranchiseUpdate
from app.services.franchise_service import (
    create_new_franchise,
    deactivate_existing_franchise,
    get_all_franchises,
    get_franchise_or_none,
    update_existing_franchise,
)


router = APIRouter(prefix="/franchises", tags=["Franchises"])


def ensure_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )


@router.get("", response_model=list[FranchiseRead])
def list_all_franchises(
    search: str | None = Query(default=None),
    status_filter: FranchiseStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    return get_all_franchises(
        db=db,
        search=search,
        status=status_filter.value if status_filter else None,
    )


@router.get("/{franchise_id}", response_model=FranchiseRead)
def get_franchise(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    franchise = get_franchise_or_none(db=db, franchise_id=franchise_id)
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franquia não encontrada.",
        )

    return franchise


@router.post("", response_model=FranchiseRead, status_code=status.HTTP_201_CREATED)
def create_franchise(
    payload: FranchiseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    return create_new_franchise(db=db, franchise_in=payload)


@router.put("/{franchise_id}", response_model=FranchiseRead)
def update_franchise_route(
    franchise_id: int,
    payload: FranchiseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    franchise = get_franchise_or_none(db=db, franchise_id=franchise_id)
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franquia não encontrada.",
        )

    return update_existing_franchise(
        db=db,
        franchise=franchise,
        franchise_in=payload,
    )


@router.delete("/{franchise_id}", response_model=FranchiseRead)
def delete_franchise_route(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    franchise = get_franchise_or_none(db=db, franchise_id=franchise_id)
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franquia não encontrada.",
        )

    return deactivate_existing_franchise(db=db, franchise=franchise)