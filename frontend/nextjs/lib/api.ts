"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// --- Backend API Response Types ---

export interface VerificationResponse {
  id: string;
  verification_type: string;
  status: string;
  proof_cid: string | null;
  data_hash: string;
  confidence_score: number;
  is_valid: boolean;
  submitter_address: string;
  tx_hash: string | null;
  ledger_sequence: number | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationListResponse {
  total: number;
  page: number;
  page_size: number;
  records: VerificationResponse[];
}

export interface AuditTrailEntry {
  timestamp: string;
  event_type: string;
  description: string;
  tx_hash: string | null;
  ipfs_cid: string | null;
}

export interface AuditTrailResponse {
  record_id: string;
  entries: AuditTrailEntry[];
  on_chain_verified: boolean;
}

export interface VerificationRequest {
  verification_type: string;
  data_hash: string;
  submitter_address: string;
  metadata?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  database: string;
  redis: string;
  ipfs: string;
  stellar: string;
}

// --- API Client ---

const API_BASE = "/api/v1";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `API error ${res.status}: ${errorBody || res.statusText}`
    );
  }

  return res.json();
}

export const api = {
  /** List verifications with optional filters and pagination */
  fetchVerifications(params?: {
    page?: number;
    page_size?: number;
    verification_type?: string;
    status?: string;
    submitter_address?: string;
  }): Promise<VerificationListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.page_size) query.set("page_size", String(params.page_size));
    if (params?.verification_type)
      query.set("verification_type", params.verification_type);
    if (params?.status) query.set("status", params.status);
    if (params?.submitter_address)
      query.set("submitter_address", params.submitter_address);

    const qs = query.toString();
    return apiFetch<VerificationListResponse>(
      `/verifications/${qs ? `?${qs}` : ""}`
    );
  },

  /** Get a single verification by ID */
  fetchVerification(id: string): Promise<VerificationResponse> {
    return apiFetch<VerificationResponse>(`/verifications/${id}`);
  },

  /** Submit a new verification */
  submitVerification(data: VerificationRequest): Promise<VerificationResponse> {
    return apiFetch<VerificationResponse>("/verifications/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Get audit trail for a verification record */
  fetchAuditTrail(recordId: string): Promise<AuditTrailResponse> {
    return apiFetch<AuditTrailResponse>(`/audit/${recordId}`);
  },

  /** Health check */
  fetchHealth(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>("/health");
  },
};

// --- Custom Hooks ---

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching data from the API.
 * Returns { data, loading, error, refetch }.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Store fetcher in a ref so execute stays stable while always using the latest fetcher
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: execute };
}

/**
 * Hook for fetching paginated verifications.
 */
export function useVerifications(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  verification_type?: string;
  submitter_address?: string;
}) {
  const deps = [
    params?.page,
    params?.page_size,
    params?.status,
    params?.verification_type,
    params?.submitter_address,
  ];

  return useApi<VerificationListResponse>(
    () => api.fetchVerifications(params),
    deps
  );
}

/**
 * Hook for fetching the audit trail of a record.
 * Returns null data when recordId is empty (no fetch attempted).
 */
export function useAuditTrail(recordId: string | null) {
  return useApi<AuditTrailResponse | null>(
    () => (recordId ? api.fetchAuditTrail(recordId) : Promise.resolve(null)),
    [recordId]
  );
}
