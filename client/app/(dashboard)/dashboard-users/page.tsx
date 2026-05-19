'use client';

import { useEffect, useState } from 'react';
import { Shield, Trash2, UserCheck, UserX, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUsers, updateUserRole, deleteUser, type User } from '@/lib/api';
import { getStoredUser } from '@/lib/session';

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = getStoredUser<User>();
    setCurrentUser(stored);
    
    if (!stored || stored.role !== 'admin') {
      setError('Access Denied: You must be an administrator to access this page.');
      setLoading(false);
      return;
    }

    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: 'admin' | 'sales') => {
    const targetRole = currentRole === 'admin' ? 'sales' : 'admin';
    setActionId(userId);
    setError('');
    setSuccess('');

    try {
      await updateUserRole(userId, targetRole);
      setSuccess(`User role updated to ${targetRole} successfully`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) {
      return;
    }

    setActionId(userId);
    setError('');
    setSuccess('');

    try {
      await deleteUser(userId);
      setSuccess('User account deleted successfully');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionId(null);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xl">
          <Shield className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You do not have administrative privileges to access this area of the dashboard.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Users Management
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review user privileges, assign admin roles, and manage system access control.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-semibold flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Table Container */}
      <div className="glass-card overflow-hidden border border-border/50 rounded-2xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/40">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground font-semibold">Retrieving user accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">
                    No registered user accounts found.
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const isSelf = u._id === currentUser._id;
                  const isCurrentAdmin = u.role === 'admin';

                  return (
                    <tr key={u._id} className="hover:bg-muted/20 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                              {u.name}
                              {isSelf && (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-primary/20 text-primary rounded-full">
                                  You
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            isCurrentAdmin
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Toggle Role Button */}
                          <button
                            onClick={() => handleRoleChange(u._id, u.role)}
                            disabled={actionId !== null || isSelf}
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                              isCurrentAdmin
                                ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700'
                                : 'text-primary hover:bg-primary/10 hover:text-primary-dark'
                            } disabled:opacity-50`}
                            title={isCurrentAdmin ? 'Demote to Sales' : 'Promote to Admin'}
                          >
                            {actionId === u._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isCurrentAdmin ? (
                              <UserX className="w-5 h-5" />
                            ) : (
                              <UserCheck className="w-5 h-5" />
                            )}
                          </button>

                          {/* Delete User Button */}
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={actionId !== null || isSelf}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                            title="Delete user permanently"
                          >
                            {actionId === u._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
