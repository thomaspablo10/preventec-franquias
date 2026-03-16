from fastapi import APIRouter

from app.core.config import settings
from app.db.session import check_database_connection


router = APIRouter()


@router.get("/health", tags=["Health"])
def healthcheck():
    database_ok = check_database_connection()

    return {
        "status": "ok" if database_ok else "degraded",
        "api": "online",
        "database": "online" if database_ok else "offline",
        "environment": settings.APP_ENV,
        "app_name": settings.APP_NAME,
    }