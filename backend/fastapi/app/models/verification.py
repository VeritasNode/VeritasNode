from datetime import datetime
from uuid import uuid4
from typing import Optional

from sqlalchemy import String, Boolean, Float, DateTime, Text, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class VerificationRecord(Base):
    """Database model for verification records."""

    __tablename__ = "verification_records"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    verification_type: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending", index=True
    )
    # IPFS CID pointing to the full proof
    proof_cid: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    # Cryptographic hash of the verified data
    data_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    # AI confidence score (0.0 to 1.0)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    # Whether verification passed
    is_valid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # Submitter address (Stellar public key)
    submitter_address: Mapped[str] = mapped_column(
        String(56), nullable=False, index=True
    )
    # Soroban transaction hash on-chain
    tx_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    # Ledger sequence number
    ledger_sequence: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    # Additional metadata as JSON
    metadata: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<VerificationRecord(id={self.id}, type={self.verification_type}, status={self.status})>"
