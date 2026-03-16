from pydantic import BaseModel


class UploadResponse(BaseModel):
    file_url: str
    original_filename: str