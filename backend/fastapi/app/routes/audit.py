from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from app.database import get_db
from app.models.verification import VerificationRecord
from app.schemas import AuditTrailResponse, AuditTrailEntry

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/{record_id}", response_model=AuditTrailResponse)
async def get_audit_trail(
    record_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get the full audit trail for a verification record.

    Returns the complete history of events including submission,
    AI verification, IPFS storage, and blockchain anchoring.
    """
    result = await db.execute(
        select(VerificationRecord).where(VerificationRecord.id == record_id)
    )
    record = result.scalar_one_or_none()

    if not record:
        raise HTTPException(status_code=404, detail="Verification record not found")

    entries = []

    # Entry 1: Submission
    entries.append(
        AuditTrailEntry(
            timestamp=record.created_at,
            event_type="verification_submitted",
            description=f"Verification request submitted for type: {record.verification_type}",
        )
    )

    # Entry 2: AI Verification (if completed)
    if record.status in ("verified", "completed", "rejected"):
        entries.append(
            AuditTrailEntry(
                timestamp=record.updated_at,
                event_type="ai_verification_complete",
                description=f"AI verification complete with confidence: {record.confidence_score:.2%}",
            )
        )

    # Entry 3: IPFS Proof Storage
    if record.proof_cid:
        entries.append(
            AuditTrailEntry(
                timestamp=record.updated_at,
                event_type="proof_stored_ipfs",
                description=f"Proof file stored on IPFS with CID: {record.proof_cid}",
                ipfs_cid=record.proof_cid,
            )
        )

    # Entry 4: Blockchain Anchoring
    if record.tx_hash:
        entries.append(
            AuditTrailEntry(
                timestamp=record.updated_at,
                event_type="anchored_to_blockchain",
                description=f"Record anchored to Stellar blockchain at ledger: {record.ledger_sequence}",
                tx_hash=record.tx_hash,
            )
        )

    return AuditTrailResponse(
        record_id=record_id,
        entries=entries,
        on_chain_verified=record.tx_hash is not None,
    )
