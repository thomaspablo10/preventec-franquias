import enum
from datetime import datetime

from sqlalchemy import Boolean, Date, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class FranchiseStatus(str, enum.Enum):
    active = "active"
    pending = "pending"
    inactive = "inactive"


franchise_status_enum = ENUM(
    FranchiseStatus,
    name="franchise_status",
    create_type=False,
)


class Franchise(Base):
    __tablename__ = "franchises"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    franchise_code: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True)
    corporate_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    trade_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    cnpj: Mapped[str | None] = mapped_column(String(18), nullable=True, unique=True)
    contact_name: Mapped[str] = mapped_column(String(150), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    status: Mapped[FranchiseStatus] = mapped_column(
        franchise_status_enum,
        nullable=False,
        default=FranchiseStatus.pending,
        server_default=FranchiseStatus.pending.value,
    )
    join_date: Mapped[Date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
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

    users = relationship("User", back_populates="franchise")
    documents = relationship("Document", back_populates="franchise")

    @staticmethod
    def build_franchise_code(sequence_number: int, reference_date: datetime | None = None) -> str:
        reference = reference_date or datetime.utcnow()
        year = reference.strftime("%y")
        day = reference.strftime("%d")
        month = reference.strftime("%m")
        bank_code = sequence_number % 100
        return f"{year}{day}{month}{bank_code:02d}"