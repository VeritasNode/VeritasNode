from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text

from app.config import get_settings
from app.database import init_db, close_db, engine
from app.routes.verification import router as verification_router
from app.routes.audit import router as audit_router
from app.schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    settings = get_settings()
    print(f"Starting {settings.app_name} v{settings.app_version}")

    # Initialize database
    try:
        await init_db()
        print("Database initialized")
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")

    yield

    # Cleanup
    await close_db()
    print("Application shutdown complete")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="VeritasNode: AI-powered data integrity verification with blockchain audit trails",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routers
    app.include_router(verification_router, prefix="/api/v1")
    app.include_router(audit_router, prefix="/api/v1")

    @app.get("/api/v1/health", response_model=HealthResponse, tags=["health"])
    async def health_check():
        """Health check endpoint for monitoring."""
        db_status = "disconnected"
        redis_status = "disconnected"
        ipfs_status = "disconnected"
        stellar_status = "disconnected"

        # Check database
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            db_status = "connected"
        except Exception:
            pass

        # Check Redis
        try:
            import redis.asyncio as redis_asyncio
            r = redis_asyncio.from_url(settings.redis_url)
            await r.ping()
            await r.close()
            redis_status = "connected"
        except Exception:
            pass

        return HealthResponse(
            status="healthy" if db_status == "connected" else "degraded",
            version=settings.app_version,
            database=db_status,
            redis=redis_status,
            ipfs=ipfs_status,
            stellar=stellar_status,
        )

    return app


app = create_app()
