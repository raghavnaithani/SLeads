import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { authApi } from '@/api/auth.api';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing, setAuth, logout, setInitializing } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const { data: user } = await authApi.getMe();
        setAuth(user, token);
      } catch (error) {
        console.error('Failed to authenticate token', error);
        logout();
      }
    };

    if (isInitializing) {
      initAuth();
    }
  }, [isInitializing, setAuth, logout, setInitializing]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
