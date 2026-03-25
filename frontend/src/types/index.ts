export interface Dispute {
  id: number;
  claimant: string;
  respondent: string;
  title: string;
  description: string;
  evidence: Evidence[];
  status: 'open' | 'resolved';
  verdict: 'FAVOR_CLAIMANT' | 'FAVOR_RESPONDENT' | 'INCONCLUSIVE' | null;
  reason: string | null;
  confidence: number | null;
  timestamp_created: number;
  timestamp_resolved: number | null;
}

export interface Evidence {
  party: 'claimant' | 'respondent';
  content: string;
}

export interface CreateDisputeRequest {
  claimant: string;
  respondent: string;
  title: string;
  description: string;
}

export interface SubmitEvidenceRequest {
  party: 'claimant' | 'respondent';
  content: string;
}

export interface HealthResponse {
  status: 'ok';
  genlayer_sdk: boolean;
  contract_address: string;
  mode: 'live' | 'mock';
  rpc_url: string;
}

export interface CreateDisputeResponse {
  success: boolean;
  dispute_id?: number;
  tx_hash?: string;
  message: string;
  mode: 'live' | 'mock';
}

export interface ResolveDisputeResponse {
  success: boolean;
  dispute?: Dispute;
  result?: Dispute;
  tx_hash?: string;
  message: string;
  mode: 'live' | 'mock';
}

export interface Scenario {
  claimant: string;
  respondent: string;
  title: string;
  description: string;
  evidence: Evidence[];
}
