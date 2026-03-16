from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.user import User
from app.repositories.document_repository import (
    create_document,
    list_documents_admin,
    list_documents_for_user,
)
from app.schemas.document import DocumentCreate


def get_all_documents_admin(
    db: Session,
    search: str | None = None,
) -> list[Document]:
    return list_documents_admin(db=db, search=search)


def get_documents_for_current_user(
    db: Session,
    user: User,
) -> list[Document]:
    return list_documents_for_user(db=db, user=user)


def create_new_document(
    db: Session,
    document_in: DocumentCreate,
) -> Document:
    return create_document(db=db, document_in=document_in)