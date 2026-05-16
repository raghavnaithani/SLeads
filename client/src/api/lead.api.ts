import api from './index';
import type {
  ILead,
  ILeadFilters,
  IPaginatedResponse,
  ICreateLeadInput,
  IUpdateLeadInput,
} from '../types/lead.types';

export const leadApi = {
  getLeads: async (filters: ILeadFilters): Promise<IPaginatedResponse<ILead>> => {
    const res = await api.get('/leads', { params: filters });
    return res.data;
  },

  getLeadById: async (id: string): Promise<{ data: ILead }> => {
    const res = await api.get(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: ICreateLeadInput): Promise<{ data: ILead }> => {
    const res = await api.post('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: IUpdateLeadInput): Promise<{ data: ILead }> => {
    const res = await api.patch(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportCsvUrl: (filters: ILeadFilters) => {
    // Generate URL string for the browser to download directly
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    
    return `${import.meta.env.VITE_API_URL || '/api/v1'}/leads/export/csv?${params.toString()}`;
  },
};
