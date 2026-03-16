from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentRead
from app.schemas.upload import UploadResponse
from app.services.document_service import (
    create_new_document,
    get_all_documents_admin,
    get_documents_for_current_user,
)
from app.utils.file_storage import save_upload_file, validate_file


router = APIRouter(prefix="/documents", tags=["Documents"])


def ensure_admin(user: User) -> None:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso não autorizado.",
        )


@router.get("", response_model=list[DocumentRead])
def list_documents(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)
    return get_all_documents_admin(db=db, search=search)


@router.post("", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
def create_document(
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)
    return create_new_document(db=db, document_in=payload)


@router.get("/my-documents", response_model=list[DocumentRead])
def list_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_documents_for_current_user(db=db, user=current_user)


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document_file(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
):
    ensure_admin(current_user)

    content = await file.read()

    try:
        validate_file(file, content)
        file_url = save_upload_file(file, content, custom_name=title)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    return UploadResponse(
        file_url=file_url,
        original_filename=file.filename or "arquivo",
    )