from pydantic_settings import BaseSettings
from functools import lru_cache
from urllib.parse import urlparse

DEFAULT_SECRET = "change-me-in-production-use-a-real-secret"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "VeritasNode API"
    app_version: str = "0.1.0"
    debug: bool = False
    environment: str = "development"

    # Database
    database_url: str = "postgresql+asyncpg://veritas:veritas123@localhost:5432/veritas"
    # Redis
    redis_url: str = "redis://localhost:6379"

    # IPFS
    ipfs_api_url: str = "http://localhost:5001"
    ipfs_gateway_url: str = "http://localhost:8080"

    # Stellar / Soroban
    stellar_network: str = "testnet"
    soroban_rpc_url: str = "https://soroban-testnet.stellar.org"
    contract_id: str = "CCER22QT2GQJAPWQKBBGZ7CF2S74OGK2POAFOP5VAW6546ODEJLVRHTY"

    # AI / ML
    model_path: str = "./models/verifier"
    confidence_threshold: float = 0.85

    # Security
    secret_key: str = DEFAULT_SECRET
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Chainlink
    chainlink_api_url: str = "http://localhost:6688"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def validate_settings_on_startup(settings: Settings) -> None:
    """Warn / fail clearly when critical env is unsafe for non-dev."""
    env = (settings.environment or "development").lower()
    # Database URL shape
    try:
        parsed = urlparse(settings.database_url)
        if not parsed.scheme or not parsed.path:
            raise ValueError("DATABASE_URL missing scheme or path")
        if "postgresql" not in parsed.scheme and "sqlite" not in parsed.scheme:
            print(
                f"Warning: DATABASE_URL scheme looks unusual: {parsed.scheme!r}"
            )
    except Exception as e:
        raise RuntimeError(f"Invalid DATABASE_URL: {e}") from e

    if env not in ("development", "dev", "test", "local"):
        if settings.secret_key == DEFAULT_SECRET or settings.secret_key.startswith(
            "change-me"
        ):
            raise RuntimeError(
                "SECRET_KEY must be set to a non-default value when "
                f"ENVIRONMENT={settings.environment!r}"
            )
    elif settings.secret_key == DEFAULT_SECRET:
        print(
            "Warning: SECRET_KEY is the default placeholder — "
            "set a real secret before production."
        )
