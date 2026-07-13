#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Map, String,
    Vec,
};

/// Represents a single verification record stored on-chain.
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct VerificationRecord {
    /// Unique identifier for the verification
    pub id: BytesN<32>,
    /// Address of the entity that submitted this record
    pub submitter: Address,
    /// Timestamp when the record was created (ledger sequence)
    pub timestamp: u64,
    /// Type of verification (e.g., "image", "document", "repository")
    pub verification_type: String,
    /// IPFS CID pointing to the full proof data
    pub proof_cid: String,
    /// Cryptographic hash of the verified data
    pub data_hash: BytesN<32>,
    /// AI confidence score (scaled by 100, e.g., 9850 = 98.50%)
    pub confidence_score: u32,
    /// Whether the verification passed
    pub is_valid: bool,
    /// Optional metadata JSON string
    pub metadata: String,
}

/// Storage keys for persistent data
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum DataKey {
    /// Total number of records stored
    RecordCount,
    /// A single verification record keyed by its ID hash
    Record(BytesN<32>),
    /// Owner/admin address
    Admin,
}

/// Type alias for a map of attributes (used for flexible metadata)
pub type AttributeMap = Map<String, String>;

/// The VeritasNode smart contract.
///
/// This contract maintains an immutable "History of Truth" by storing
/// AI-verified data integrity records on the Stellar blockchain via Soroban.
/// Each record includes a cryptographic hash, IPFS proof location, and
/// AI confidence score, creating a transparent and auditable trail.
#[contract]
pub struct VeritasNode;

#[contractimpl]
impl VeritasNode {
    /// Initialize the contract, setting the admin address.
    ///
    /// # Arguments
    /// * `admin` - The address that will have administrative privileges
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        // Set admin if not already set
        if env.storage().instance().get::<DataKey, Address>(&DataKey::Admin).is_none() {
            env.storage().instance().set(&DataKey::Admin, &admin);
            env.storage().instance().set(&DataKey::RecordCount, &0u64);
        }
    }

    /// Submit a new verification record to the History of Truth.
    ///
    /// # Arguments
    /// * `id` - Unique identifier for this verification
    /// * `verification_type` - Category of verification (e.g., "image", "document")
    /// * `proof_cid` - IPFS content identifier for the proof file
    /// * `data_hash` - Cryptographic hash of the verified data
    /// * `confidence_score` - AI confidence (0-10000, representing 0.00%-100.00%)
    /// * `is_valid` - Whether the verification passed
    /// * `metadata` - Optional JSON string with additional context
    ///
    /// # Returns
    /// The total number of records after submission
    pub fn submit_verification(
        env: Env,
        submitter: Address,
        id: BytesN<32>,
        verification_type: String,
        proof_cid: String,
        data_hash: BytesN<32>,
        confidence_score: u32,
        is_valid: bool,
        metadata: String,
    ) -> u64 {
        submitter.require_auth();

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::RecordCount)
            .unwrap_or(0);

        let record = VerificationRecord {
            id: id.clone(),
            submitter: submitter.clone(),
            timestamp: env.ledger().sequence() as u64,
            verification_type,
            proof_cid,
            data_hash,
            confidence_score,
            is_valid,
            metadata,
        };

        env.storage().persistent().set(&DataKey::Record(id.clone()), &record);

        count += 1;
        env.storage().instance().set(&DataKey::RecordCount, &count);

        // Emit event for off-chain listeners
        env.events()
            .publish((symbol_short!("verif_sub"), submitter, id), count);

        count
    }

    /// Retrieve a verification record by its ID.
    ///
    /// # Arguments
    /// * `id` - The unique identifier of the record to retrieve
    ///
    /// # Returns
    /// The VerificationRecord if found, or None
    pub fn get_verification(
        env: Env,
        id: BytesN<32>,
    ) -> Option<VerificationRecord> {
        env.storage().persistent().get(&DataKey::Record(id))
    }

    /// Get the total number of verification records stored.
    ///
    /// # Returns
    /// The count of all verification records
    pub fn get_record_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::RecordCount)
            .unwrap_or(0)
    }

    /// Check if a specific verification record exists.
    ///
    /// # Arguments
    /// * `id` - The unique identifier to check
    ///
    /// # Returns
    /// true if the record exists
    pub fn record_exists(env: Env, id: BytesN<32>) -> bool {
        env.storage().persistent().has(&DataKey::Record(id))
    }

    /// Get the admin address.
    ///
    /// # Returns
    /// The admin address if set, or None
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Admin)
    }

    /// Transfer admin privileges to a new address.
    /// Only callable by the current admin.
    ///
    /// # Arguments
    /// * `new_admin` - The address to transfer admin rights to
    pub fn transfer_admin(env: Env, new_admin: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("contract not initialized");

        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);

        env.events()
            .publish((symbol_short!("admin_xfr"), admin, new_admin), ());
    }
}

#[cfg(test)]
mod test;
