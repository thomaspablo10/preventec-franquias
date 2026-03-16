from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.document import DocumentScope


class DocumentBase(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    file_url: str
    scope: DocumentScope = DocumentScope.global_
    franchise_id: int | None = None
    is_active: bool = True


class DocumentCreate(DocumentBase):
    pass


class DocumentRead(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)