from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.document import Document, DocumentScope
from app.models.user import User
from app.schemas.document import DocumentCreate


def list_documents_admin(
    db: Session,
    search: str | None = None,
) -> list[Document]:
    query = db.query(Document)

    if search:
        normalized_search = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Document.title.ilike(normalized_search),
                Document.description.ilike(normalized_search),
                Document.category.ilike(normalized_search),
            )
        )

    return query.order_by(Document.created_at.desc()).all()


def list_documents_for_user(
    db: Session,
    user: User,
) -> list[Document]:
    query = db.query(Document).filter(Document.is_active == True)  # noqa: E712

    if user.role == "admin":
        return query.order_by(Document.created_at.desc()).all()

    franchise_id = user.franchise_id

    query = query.filter(
        or_(
            Document.scope == DocumentScope.global_,
            Document.franchise_id == franchise_id,
        )
    )

    return query.order_by(Document.created_at.desc()).all()


def create_document(db: Session, document_in: DocumentCreate) -> Document:
    document = Document(
        title=document_in.title.strip(),
        description=document_in.description.strip() if document_in.description else None,
        category=document_in.category.strip() if document_in.category else None,
        file_url=document_in.file_url.strip(),
        scope=document_in.scope,
        franchise_id=document_in.franchise_id,
        is_active=document_in.is_active,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document