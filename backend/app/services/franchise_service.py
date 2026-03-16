from sqlalchemy.orm import Session

from app.models.franchise import Franchise
from app.repositories.franchise_repository import (
    create_franchise,
    deactivate_franchise,
    get_franchise_by_id,
    list_franchises,
    update_franchise,
)
from app.schemas.franchise import FranchiseCreate, FranchiseUpdate


def get_all_franchises(
    db: Session,
    search: str | None = None,
    status: str | None = None,
) -> list[Franchise]:
    return list_franchises(db=db, search=search, status=status)


def get_franchise_or_none(db: Session, franchise_id: int) -> Franchise | None:
    return get_franchise_by_id(db=db, franchise_id=franchise_id)


def create_new_franchise(db: Session, franchise_in: FranchiseCreate) -> Franchise:
    return create_franchise(db=db, franchise_in=franchise_in)


def update_existing_franchise(
    db: Session,
    franchise: Franchise,
    franchise_in: FranchiseUpdate,
) -> Franchise:
    return update_franchise(db=db, franchise=franchise, franchise_in=franchise_in)


def deactivate_existing_franchise(
    db: Session,
    franchise: Franchise,
) -> Franchise:
    return deactivate_franchise(db=db, franchise=franchise)