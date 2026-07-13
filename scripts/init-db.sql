-- VeritasNode Database Initialization
-- Creates the schema and seed data for development

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verification records table
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    proof_cid VARCHAR(256),
    data_hash VARCHAR(128) NOT NULL,
    confidence_score FLOAT NOT NULL DEFAULT 0.0,
    is_valid BOOLEAN NOT NULL DEFAULT FALSE,
    submitter_address VARCHAR(56) NOT NULL,
    tx_hash VARCHAR(64),
    ledger_sequence INTEGER,
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_verification_type ON verification_records(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_records(status);
CREATE INDEX IF NOT EXISTS idx_verification_submitter ON verification_records(submitter_address);
CREATE INDEX IF NOT EXISTS idx_verification_created ON verification_records(created_at DESC);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL REFERENCES verification_records(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verification_records_updated_at
    BEFORE UPDATE ON verification_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
