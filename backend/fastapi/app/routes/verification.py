from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import logging

from app.database import get_db
from app.models.verification import VerificationRecord
from app.schemas import (
    VerificationRequest,
    VerificationResponse,
    VerificationListResponse,
)
from app.services.stellar_service import stellar_service
from app.services.ai_verifier import verifier

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/verifications", tags=["verifications"])


@router.post("/", response_model=VerificationResponse, status_code=201)
async def submit_verification(
    request: VerificationRequest,
    db: AsyncSession = Depends(get_db),
):
    """Submit a new data integrity verification request.

    The verification is processed by the AI engine, stored in the database,
    and anchored to the Stellar blockchain via the Soroban contract.
    """
    # Verify the data hash format
    try:
        bytes.fromhex(request.data_hash)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="data_hash must be a valid hex string",
        )

    # Step 1: Create the pending record in the database
    record = VerificationRecord(
        verification_type=request.verification_type,
        data_hash=request.data_hash,
        submitter_address=request.submitter_address,
        metadata=request.metadata,
        status="processing",
    )

    db.add(record)
    await db.flush()
    await db.refresh(record)

    # Step 2: Run AI verification
    try:
        result = await _run_ai_verification(
            request.verification_type,
            request.data_hash,
        )
        record.confidence_score = result.confidence_score
        record.is_valid = result.is_valid
        record.proof_cid = result.proof_cid
        logger.info(
            f"AI verification complete for {record.id}: "
            f"valid={result.is_valid}, confidence={result.confidence_score:.2%}"
        )
    except Exception as e:
        logger.error(f"AI verification failed for {record.id}: {e}")
        record.status = "failed"
        await db.commit()
        await db.refresh(record)
        return VerificationResponse.model_validate(record)

    # Step 3: Anchor to Stellar blockchain
    try:
        receipt = await stellar_service.submit_to_blockchain(
            verification_id=record.id,
            verification_type=request.verification_type,
            data_hash=request.data_hash,
            proof_cid=record.proof_cid or "pending",
            confidence_score=record.confidence_score,
            is_valid=record.is_valid,
            submitter_secret="",  # Not needed in mock mode; production uses env
        )

        if receipt and receipt.success:
            record.tx_hash = receipt.tx_hash
            record.ledger_sequence = receipt.ledger_sequence
            record.status = "verified"
            logger.info(
                f"Anchored {record.id} to Stellar: "
                f"tx={receipt.tx_hash}, ledger={receipt.ledger_sequence}"
            )
        else:
            record.status = "verification_failed"
            logger.warning(f"Blockchain submission failed for {record.id}")
    except Exception as e:
        record.status = "verification_failed"
        logger.error(f"Blockchain submission error for {record.id}: {e}")

    await db.commit()
    await db.refresh(record)

    return VerificationResponse.model_validate(record)


@router.get("/{record_id}", response_model=VerificationResponse)
async def get_verification(
    record_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve a specific verification record by ID."""
    result = await db.execute(
        select(VerificationRecord).where(VerificationRecord.id == record_id)
    )
    record = result.scalar_one_or_none()

    if not record:
        raise HTTPException(status_code=404, detail="Verification record not found")

    return VerificationResponse.model_validate(record)


@router.get("/", response_model=VerificationListResponse)
async def list_verifications(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    verification_type: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    submitter_address: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """List verification records with optional filtering."""
    query = select(VerificationRecord)

    if verification_type:
        query = query.where(VerificationRecord.verification_type == verification_type)
    if status:
        query = query.where(VerificationRecord.status == status)
    if submitter_address:
        query = query.where(VerificationRecord.submitter_address == submitter_address)

    # Count total matching records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(VerificationRecord.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    records = result.scalars().all()

    return VerificationListResponse(
        total=total,
        page=page,
        page_size=page_size,
        records=[VerificationResponse.model_validate(r) for r in records],
    )


async def _run_ai_verification(
    verification_type: str,
    data_hash: str,
    metadata: Optional[str] = None,
):
    """Run the AI verification pipeline for a given data hash.

    Dispatches to the appropriate verifier method based on type.
    """
    if verification_type == "image":
        return await verifier.verify_image(b"", data_hash)
    elif verification_type == "document":
        return await verifier.verify_document(data_hash, data_hash)
    elif verification_type == "repository":
        return await verifier.verify_repository(data_hash)
    else:
        return await verifier.verify_data(verification_type, data_hash, metadata)
