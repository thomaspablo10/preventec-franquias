from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.dashboard import router as dashboard_router
from app.api.v1.routes.documents import router as documents_router
from app.api.v1.routes.franchises import router as franchises_router
from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.portal import router as portal_router
from app.api.v1.routes.tickets import router as tickets_router
from app.api.v1.routes.users import router as users_router
from app.api.v1.routes.reports import router as reports_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.APP_DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")

app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(franchises_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(portal_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(tickets_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "docs": "/docs",
        "healthcheck": "/api/v1/health",
    }