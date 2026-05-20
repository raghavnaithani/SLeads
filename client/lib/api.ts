import { getAuthToken } from './session';

const DEFAULT_API_URL = 'http://localhost:5000/api/v1';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiListEnvelope<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: PaginationMeta;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  source: LeadSource;
  status?: LeadStatus;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  source?: LeadSource;
  status?: LeadStatus;
}

export interface LeadQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: 'latest' | 'oldest';
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface LeadListResult {
  leads: Lead[];
  pagination: PaginationMeta;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  return parseResponse<T>(response);
}

function toQueryString(params: Record<string, any>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export async function login(input: LoginInput) {
  const response = await request<ApiEnvelope<AuthResult>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function register(input: RegisterInput) {
  const response = await request<ApiEnvelope<AuthResult>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function getMe() {
  const response = await request<ApiEnvelope<User>>('/auth/me');
  return response.data;
}

export async function getLeads(filters: LeadQuery = {}) {
  const query = toQueryString(filters);
  const response = await request<ApiEnvelope<Lead[]> & { pagination?: PaginationMeta }>(
    `/leads${query ? `?${query}` : ''}`,
  );

  return {
    leads: response.data,
    pagination: response.pagination ?? { total: response.data.length, page: 1, limit: response.data.length || 1, totalPages: 1 },
  } satisfies LeadListResult;
}

export async function createLead(input: CreateLeadInput) {
  const response = await request<ApiEnvelope<Lead>>('/leads', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const response = await request<ApiEnvelope<Lead>>(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function deleteLead(id: string) {
  const response = await request<ApiEnvelope<null>>(`/leads/${id}`, {
    method: 'DELETE',
  });

  return response.message;
}

export async function exportLeadsCsv(filters: Omit<LeadQuery, 'page' | 'limit'> = {}) {
  const query = toQueryString(filters);
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/leads/export/csv${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to export leads');
  }

  return response.blob();
}

export async function logout() {
  const response = await request<ApiEnvelope<null>>('/auth/logout', { method: 'POST' });
  return response.message;
}

export async function getUsers() {
  const response = await request<ApiEnvelope<User[]>>('/users');
  return response.data;
}

export async function updateUserRole(id: string, role: UserRole) {
  const response = await request<ApiEnvelope<User>>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await request<ApiEnvelope<null>>(`/users/${id}`, {
    method: 'DELETE',
  });
  return response.message;
}
