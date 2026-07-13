from pydantic_settings import BaseSettings
from functools import lru_cache


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
    secret_key: str = "change-me-in-production-use-a-real-secret"
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
