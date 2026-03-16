from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    APP_NAME: str = "Preventec Franquias API"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    POSTGRES_SERVER: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "preventec_franquias"
    POSTGRES_USER: str = "preventec_user"
    POSTGRES_PASSWORD: str = "preventec_password"

    DATABASE_URL: str = "postgresql://preventec_user:preventec_password@postgres:5432/preventec_franquias"

    SECRET_KEY: str = "change_this_in_production_preventec_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    UPLOAD_DIR: str = "/app/uploads"
    BASE_FILE_URL: str = "http://localhost:8000/uploads"


settings = Settings()