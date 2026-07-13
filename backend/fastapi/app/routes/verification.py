from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import hashlib

from app.database import get_db
from app.models.verification import VerificationRecord
from app.schemas import (
    VerificationRequest,
    VerificationResponse,
    VerificationListResponse,
)

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

    record = VerificationRecord(
        verification_type=request.verification_type,
        data_hash=request.data_hash,
        submitter_address=request.submitter_address,
        metadata=request.metadata,
        status="pending",
    )

    db.add(record)
    await db.flush()
    await db.refresh(record)

    # In production, this would trigger async AI verification and
    # Soroban contract submission

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
