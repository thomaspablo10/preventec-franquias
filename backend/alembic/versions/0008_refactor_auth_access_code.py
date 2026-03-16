"""refactor auth to access code and user profile

Revision ID: 0008_auth_access_code
Revises: 0007_read_tracking
Create Date: 2026-03-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0008_auth_access_code"
down_revision: Union[str, None] = "0007_read_tracking"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


FRANCHISOR_ACCESS_CODE = "26000001"


def upgrade() -> None:
    op.add_column("franchises", sa.Column("franchise_code", sa.String(length=20), nullable=True))
    op.execute(
        """
        UPDATE franchises
        SET franchise_code = CONCAT(
            TO_CHAR(COALESCE(created_at, NOW()), 'YY'),
            TO_CHAR(COALESCE(created_at, NOW()), 'DD'),
            TO_CHAR(COALESCE(created_at, NOW()), 'MM'),
            LPAD((id % 100)::text, 2, '0')
        )
        WHERE franchise_code IS NULL
        """
    )
    op.alter_column("franchises", "franchise_code", existing_type=sa.String(length=20), nullable=False)
    op.create_index(op.f("ix_franchises_franchise_code"), "franchises", ["franchise_code"], unique=True)

    op.add_column("users", sa.Column("access_code", sa.String(length=20), nullable=True))
    op.add_column("users", sa.Column("username", sa.String(length=50), nullable=True))
    op.add_column("users", sa.Column("first_name", sa.String(length=80), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("cpf", sa.String(length=11), nullable=True))
    op.add_column("users", sa.Column("birth_date", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("gender", sa.String(length=30), nullable=True))
    op.add_column("users", sa.Column("phone", sa.String(length=20), nullable=True))
    op.add_column("users", sa.Column("whatsapp", sa.String(length=20), nullable=True))
    op.add_column("users", sa.Column("job_title", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("profile_photo_path", sa.String(length=255), nullable=True))
    op.add_column(
        "users",
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column(
        "users",
        sa.Column("first_login_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.add_column(
        "users",
        sa.Column("must_change_password", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.add_column(
        "users",
        sa.Column("must_complete_profile", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )

    op.execute(
        f"""
        UPDATE users
        SET access_code = COALESCE(
            (
                SELECT f.franchise_code
                FROM franchises f
                WHERE f.id = users.franchise_id
            ),
            '{FRANCHISOR_ACCESS_CODE}'
        )
        WHERE access_code IS NULL
        """
    )
    op.execute(
        """
        UPDATE users
        SET username = CASE
            WHEN role = 'admin' THEN 'admin'
            ELSE CONCAT('user', id)
        END
        WHERE username IS NULL
        """
    )
    op.execute(
        """
        UPDATE users
        SET first_name = COALESCE(NULLIF(split_part(full_name, ' ', 1), ''), full_name)
        WHERE first_name IS NULL
        """
    )
    op.execute(
        """
        UPDATE users
        SET last_name = CASE
            WHEN position(' ' in full_name) > 0 THEN btrim(substr(full_name, position(' ' in full_name) + 1))
            ELSE NULL
        END
        WHERE last_name IS NULL
        """
    )

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.alter_column("users", "email", existing_type=sa.String(length=255), nullable=True)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)

    op.alter_column("users", "access_code", existing_type=sa.String(length=20), nullable=False)
    op.alter_column("users", "username", existing_type=sa.String(length=50), nullable=False)

    op.create_index(op.f("ix_users_access_code"), "users", ["access_code"], unique=False)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=False)
    op.create_index(op.f("ix_users_cpf"), "users", ["cpf"], unique=True)
    op.create_index(
        "uq_users_access_code_username",
        "users",
        ["access_code", "username"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index("uq_users_access_code_username", table_name="users")
    op.drop_index(op.f("ix_users_cpf"), table_name="users")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_access_code"), table_name="users")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.alter_column("users", "email", existing_type=sa.String(length=255), nullable=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.drop_column("users", "must_complete_profile")
    op.drop_column("users", "must_change_password")
    op.drop_column("users", "first_login_completed")
    op.drop_column("users", "is_primary")
    op.drop_column("users", "profile_photo_path")
    op.drop_column("users", "job_title")
    op.drop_column("users", "whatsapp")
    op.drop_column("users", "phone")
    op.drop_column("users", "gender")
    op.drop_column("users", "birth_date")
    op.drop_column("users", "cpf")
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
    op.drop_column("users", "username")
    op.drop_column("users", "access_code")

    op.drop_index(op.f("ix_franchises_franchise_code"), table_name="franchises")
    op.drop_column("franchises", "franchise_code")