import re
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".txt",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def ensure_upload_dir() -> Path:
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


def validate_file(file: UploadFile, content: bytes) -> None:
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Tipo de arquivo não permitido.")

    if len(content) > MAX_FILE_SIZE:
        raise ValueError("Arquivo excede o tamanho máximo de 10 MB.")


def slugify_filename(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^\w\s-]", "", value, flags=re.UNICODE)
    value = re.sub(r"[-\s]+", "-", value).strip("-")
    return value or "arquivo"


def save_upload_file(
    file: UploadFile,
    content: bytes,
    custom_name: str | None = None,
) -> str:
    upload_dir = ensure_upload_dir()

    extension = Path(file.filename or "").suffix.lower()

    base_name_source = custom_name or Path(file.filename or "arquivo").stem
    base_name = slugify_filename(base_name_source)

    unique_suffix = uuid.uuid4().hex[:6]
    final_name = f"{base_name}-{unique_suffix}{extension}"

    destination = upload_dir / final_name

    with open(destination, "wb") as output_file:
        output_file.write(content)

    return f"{settings.BASE_FILE_URL}/{final_name}"