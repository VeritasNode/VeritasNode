#![cfg(test)]

use crate::{VeritasNode, VeritasNodeClient};
use soroban_sdk::{testutils::Address as _, vec, Address, BytesN, Env, String};

fn create_contract(e: &Env) -> (Address, VeritasNodeClient) {
    let admin = Address::generate(e);
    let contract_id = e.register(VeritasNode, ());
    let client = VeritasNodeClient::new(e, &contract_id);

    client.initialize(&admin);

    (admin, client)
}

#[test]
fn test_initialize() {
    let env = Env::default();
    let (admin, client) = create_contract(&env);

    let stored_admin = client.get_admin();
    assert_eq!(stored_admin, Some(admin));
    assert_eq!(client.get_record_count(), 0);
}

#[test]
fn test_submit_verification() {
    let env = Env::default();
    let (admin, client) = create_contract(&env);

    let id = BytesN::from_array(&env, &[1u8; 32]);
    let verification_type = String::from_str(&env, "image");
    let proof_cid = String::from_str(&env, "QmTest123ProofCID");
    let data_hash = BytesN::from_array(&env, &[2u8; 32]);
    let metadata = String::from_str(&env, r#"{"source":"satellite"}"#);

    let count = client.submit_verification(
        &admin,
        &id,
        &verification_type,
        &proof_cid,
        &data_hash,
        &9850u32,
        &true,
        &metadata,
    );

    assert_eq!(count, 1);
    assert_eq!(client.get_record_count(), 1);
    assert!(client.record_exists(&id));

    let record = client.get_verification(&id);
    assert!(record.is_some());

    let record = record.unwrap();
    assert_eq!(record.id, id);
    assert_eq!(record.submitter, admin);
    assert_eq!(record.verification_type, verification_type);
    assert_eq!(record.proof_cid, proof_cid);
    assert_eq!(record.data_hash, data_hash);
    assert_eq!(record.confidence_score, 9850);
    assert!(record.is_valid);
    assert_eq!(record.metadata, metadata);
}

#[test]
fn test_multiple_verifications() {
    let env = Env::default();
    let (admin, client) = create_contract(&env);

    for i in 0u8..5 {
        let id = BytesN::from_array(&env, &[i; 32]);
        let count = client.submit_verification(
            &admin,
            &id,
            &String::from_str(&env, "document"),
            &String::from_str(&env, "QmTest"),
            &BytesN::from_array(&env, &[i + 10; 32]),
            &9000u32,
            &true,
            &String::from_str(&env, "{}"),
        );
        assert_eq!(count, (i + 1) as u64);
    }

    assert_eq!(client.get_record_count(), 5);
}

#[test]
fn test_transfer_admin() {
    let env = Env::default();
    let (admin, client) = create_contract(&env);

    let new_admin = Address::generate(&env);

    client.transfer_admin(&new_admin);

    let stored_admin = client.get_admin();
    assert_eq!(stored_admin, Some(new_admin));
}

#[test]
fn test_nonexistent_record() {
    let env = Env::default();
    let (_admin, client) = create_contract(&env);

    let fake_id = BytesN::from_array(&env, &[99u8; 32]);

    assert!(!client.record_exists(&fake_id));
    assert_eq!(client.get_verification(&fake_id), None);
}

#[test]
#[should_panic(expected = "contract not initialized")]
fn test_uninitialized_contract() {
    let env = Env::default();
    let contract_id = env.register(VeritasNode, ());
    let client = VeritasNodeClient::new(&env, &contract_id);

    // This should panic because the contract hasn't been initialized
    client.get_admin();
}

#[test]
fn test_invalid_verification() {
    let env = Env::default();
    let (admin, client) = create_contract(&env);

    let id = BytesN::from_array(&env, &[42u8; 32]);

    let count = client.submit_verification(
        &admin,
        &id,
        &String::from_str(&env, "repository"),
        &String::from_str(&env, "QmFailedProof"),
        &BytesN::from_array(&env, &[0u8; 32]),
        &2500u32,
        &false,
        &String::from_str(&env, r#"{"reason":"pattern mismatch"}"#),
    );

    assert_eq!(count, 1);

    let record = client.get_verification(&id).unwrap();
    assert!(!record.is_valid);
    assert_eq!(record.confidence_score, 2500);
}
