import { create } from 'zustand';
import type { IUser } from '../types/auth.types';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: IUser, token: string) => void;
  logout: () => void;
  setInitializing: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true, isInitializing: false });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isInitializing: false });
  },
  setInitializing: (val) => set({ isInitializing: val }),
}));
