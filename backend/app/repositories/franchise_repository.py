from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.franchise import Franchise, FranchiseStatus
from app.schemas.franchise import FranchiseCreate, FranchiseUpdate


def list_franchises(
    db: Session,
    search: str | None = None,
    status: str | None = None,
) -> list[Franchise]:
    query = db.query(Franchise)

    if search:
        normalized_search = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Franchise.corporate_name.ilike(normalized_search),
                Franchise.trade_name.ilike(normalized_search),
                Franchise.contact_name.ilike(normalized_search),
                Franchise.contact_email.ilike(normalized_search),
                Franchise.city.ilike(normalized_search),
            )
        )

    if status:
        query = query.filter(Franchise.status == status)

    return query.order_by(Franchise.created_at.desc()).all()


def get_franchise_by_id(db: Session, franchise_id: int) -> Franchise | None:
    return db.query(Franchise).filter(Franchise.id == franchise_id).first()


def create_franchise(db: Session, franchise_in: FranchiseCreate) -> Franchise:
    franchise = Franchise(
        corporate_name=franchise_in.corporate_name.strip(),
        trade_name=franchise_in.trade_name.strip(),
        cnpj=franchise_in.cnpj.strip() if franchise_in.cnpj else None,
        contact_name=franchise_in.contact_name.strip(),
        contact_email=str(franchise_in.contact_email).lower().strip(),
        contact_phone=franchise_in.contact_phone.strip() if franchise_in.contact_phone else None,
        city=franchise_in.city.strip(),
        state=franchise_in.state.strip().upper(),
        status=franchise_in.status,
        join_date=franchise_in.join_date,
        notes=franchise_in.notes.strip() if franchise_in.notes else None,
        is_active=franchise_in.is_active,
    )
    db.add(franchise)
    db.commit()
    db.refresh(franchise)
    return franchise


def update_franchise(
    db: Session,
    franchise: Franchise,
    franchise_in: FranchiseUpdate,
) -> Franchise:
    update_data = franchise_in.model_dump(exclude_unset=True)

    if "corporate_name" in update_data and update_data["corporate_name"] is not None:
        franchise.corporate_name = update_data["corporate_name"].strip()

    if "trade_name" in update_data and update_data["trade_name"] is not None:
        franchise.trade_name = update_data["trade_name"].strip()

    if "cnpj" in update_data:
        franchise.cnpj = update_data["cnpj"].strip() if update_data["cnpj"] else None

    if "contact_name" in update_data and update_data["contact_name"] is not None:
        franchise.contact_name = update_data["contact_name"].strip()

    if "contact_email" in update_data and update_data["contact_email"] is not None:
        franchise.contact_email = str(update_data["contact_email"]).lower().strip()

    if "contact_phone" in update_data:
        franchise.contact_phone = (
            update_data["contact_phone"].strip() if update_data["contact_phone"] else None
        )

    if "city" in update_data and update_data["city"] is not None:
        franchise.city = update_data["city"].strip()

    if "state" in update_data and update_data["state"] is not None:
        franchise.state = update_data["state"].strip().upper()

    if "status" in update_data and update_data["status"] is not None:
        franchise.status = update_data["status"]

    if "join_date" in update_data:
        franchise.join_date = update_data["join_date"]

    if "notes" in update_data:
        franchise.notes = update_data["notes"].strip() if update_data["notes"] else None

    if "is_active" in update_data and update_data["is_active"] is not None:
        franchise.is_active = update_data["is_active"]

    db.commit()
    db.refresh(franchise)
    return franchise


def deactivate_franchise(db: Session, franchise: Franchise) -> Franchise:
    franchise.is_active = False
    franchise.status = FranchiseStatus.inactive
    db.commit()
    db.refresh(franchise)
    return franchise