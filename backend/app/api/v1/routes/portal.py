from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.franchise import FranchiseRead
from app.services.franchise_service import get_franchise_or_none


router = APIRouter(prefix="/portal", tags=["Portal"])


@router.get("/my-franchise", response_model=FranchiseRead)
def get_my_franchise(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "franchisee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )

    if not current_user.franchise_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não está vinculado a nenhuma franquia.",
        )

    franchise = get_franchise_or_none(db=db, franchise_id=current_user.franchise_id)
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franquia vinculada não encontrada.",
        )

    return franchise