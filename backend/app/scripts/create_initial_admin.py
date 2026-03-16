from app.db.session import SessionLocal
from app.models.user import UserRole
from app.repositories.user_repository import (
    FRANCHISOR_ACCESS_CODE,
    create_user,
    get_user_by_access_code_and_username,
)
from app.schemas.user import UserCreate


ADMIN_USERNAME = "admin"
ADMIN_DEFAULT_PASSWORD = "senha123"


def run() -> None:
    db = SessionLocal()

    try:
        existing_user = get_user_by_access_code_and_username(
            db,
            FRANCHISOR_ACCESS_CODE,
            ADMIN_USERNAME,
        )
        if existing_user:
            print(
                "Usuário admin já existe: "
                f"{existing_user.access_code} / {existing_user.username}"
            )
            return

        user_in = UserCreate(
            access_code=FRANCHISOR_ACCESS_CODE,
            username=ADMIN_USERNAME,
            full_name="Administrador Preventec",
            email="admin@preventec.com",
            password=ADMIN_DEFAULT_PASSWORD,
            role=UserRole.admin,
            is_active=True,
        )

        user = create_user(db, user_in)
        print(
            "Usuário admin criado com sucesso: "
            f"{user.access_code} / {user.username}"
        )
    finally:
        db.close()


if __name__ == "__main__":
    run()