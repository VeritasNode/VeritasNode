from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class VerificationRequest(BaseModel):
    """Request schema for submitting a new verification."""

    verification_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        examples=["image", "document", "repository"],
        description="Type of verification to perform",
    )
    data_hash: str = Field(
        ...,
        min_length=64,
        max_length=128,
        description="SHA-256 hash of the data being verified",
    )
    submitter_address: str = Field(
        ...,
        min_length=56,
        max_length=56,
        description="Stellar public key of the submitter",
    )
    metadata: Optional[str] = Field(
        default=None,
        description="Additional JSON metadata for the verification",
    )


class VerificationResponse(BaseModel):
    """Response schema for verification results."""

    id: str
    verification_type: str
    status: str
    proof_cid: Optional[str] = None
    data_hash: str
    confidence_score: float
    is_valid: bool
    submitter_address: str
    tx_hash: Optional[str] = None
    ledger_sequence: Optional[int] = None
    metadata: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VerificationListResponse(BaseModel):
    """Response schema for listing verifications."""

    total: int
    page: int
    page_size: int
    records: list[VerificationResponse]


class AuditTrailEntry(BaseModel):
    """A single entry in the audit trail."""

    timestamp: datetime
    event_type: str
    description: str
    tx_hash: Optional[str] = None
    ipfs_cid: Optional[str] = None


class AuditTrailResponse(BaseModel):
    """Response schema for audit trail."""

    record_id: str
    entries: list[AuditTrailEntry]
    on_chain_verified: bool


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str
    database: str
    redis: str
    ipfs: str
    stellar: str
