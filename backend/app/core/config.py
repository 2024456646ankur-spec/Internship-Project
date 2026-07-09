"""
Application configuration — loaded from .env via pydantic-settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Application
    APP_NAME: str = "rehearsal-room"
    APP_ENV: str = "development"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # PostgreSQL
    DATABASE_URL: str

    # MongoDB
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "rehearsal_room"

    # LLMs
    GEMINI_API_KEY: str
    GROQ_API_KEY: str
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GROQ_MODEL: str = "llama3-8b-8192"

    # Code Execution
    CODE_EXEC_TIMEOUT_SECONDS: int = 10
    ALLOWED_LANGUAGES: str = "python,javascript,java,cpp,c,go,rust"

    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    @property
    def allowed_languages_list(self) -> list[str]:
        return [lang.strip() for lang in self.ALLOWED_LANGUAGES.split(",")]


settings = Settings()
