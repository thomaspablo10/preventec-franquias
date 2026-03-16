import enum

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class DocumentScope(str, enum.Enum):
    global_ = "global"
    franchise = "franchise"


document_scope_enum = ENUM(
    DocumentScope,
    name="document_scope",
    create_type=False,
    values_callable=lambda enum_cls: [item.value for item in enum_cls],
)


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    scope: Mapped[DocumentScope] = mapped_column(
        document_scope_enum,
        nullable=False,
        default=DocumentScope.global_,
        server_default=DocumentScope.global_.value,
    )
    franchise_id: Mapped[int | None] = mapped_column(
        ForeignKey("franchises.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    franchise = relationship("Franchise", back_populates="documents")