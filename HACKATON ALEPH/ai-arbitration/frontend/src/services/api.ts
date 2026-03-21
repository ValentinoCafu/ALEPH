import axios from 'axios';
import type {
  HealthResponse,
  CreateDisputeRequest,
  CreateDisputeResponse,
  SubmitEvidenceRequest,
  Dispute,
  ResolveDisputeResponse,
} from '../types';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};

export const disputesApi = {
  create: async (data: CreateDisputeRequest): Promise<CreateDisputeResponse> => {
    const response = await api.post<CreateDisputeResponse>('/disputes', data);
    return response.data;
  },

  getAll: async (): Promise<{ disputes: Dispute[]; mode: 'live' | 'mock' }> => {
    const response = await api.get('/disputes');
    return response.data;
  },

  getOne: async (id: number): Promise<Dispute> => {
    const response = await api.get<Dispute>(`/disputes/${id}`);
    return response.data;
  },

  submitEvidence: async (id: number, data: SubmitEvidenceRequest) => {
    const response = await api.post(`/disputes/${id}/evidence`, data);
    return response.data;
  },

  resolve: async (id: number): Promise<ResolveDisputeResponse> => {
    const response = await api.post<ResolveDisputeResponse>(`/disputes/${id}/resolve`);
    return response.data;
  },
};
