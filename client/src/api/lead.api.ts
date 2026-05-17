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
};
