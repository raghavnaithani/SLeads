import api from './index';
import type { IRegisterInput, ILoginInput, IAuthResponse, IUser } from '../types/auth.types';

export const authApi = {
  register: async (data: IRegisterInput): Promise<IAuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: ILoginInput): Promise<IAuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<{ data: IUser }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
