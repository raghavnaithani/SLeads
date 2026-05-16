import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function DashboardPlaceholder() {
  const logout = import('@/store/auth.store').then(m => m.useAuthStore.getState().logout);
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground gap-4">
      <h1 className="text-3xl font-bold">Dashboard Placeholder</h1>
      <button 
        onClick={() => logout.then(fn => fn())} 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
