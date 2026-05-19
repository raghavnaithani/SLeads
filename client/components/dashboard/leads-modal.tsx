'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Lead, LeadSource, LeadStatus } from '@/lib/api';
import { createLead, updateLead } from '@/lib/api';

interface LeadsModalProps {
  onClose: () => void;
  lead?: Lead | null;
  onSaved?: () => void;
}

export default function LeadsModal({ onClose, lead, onSaved }: LeadsModalProps) {
  const isEditing = !!lead;
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    source: lead?.source || 'website',
    status: lead?.status || 'new',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && lead) {
        await updateLead(lead._id, {
          name: formData.name,
          email: formData.email,
          source: formData.source as LeadSource,
          status: formData.status as LeadStatus,
        });
      } else {
        await createLead({
          name: formData.name,
          email: formData.email,
          source: formData.source as LeadSource,
          status: formData.status as LeadStatus,
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} lead`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Lead' : 'Create New Lead'}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Lead name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Lead email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>

            {/* Source Dropdown */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              >
                <option value="website">Website</option>
                <option value="instagram">Instagram</option>
                <option value="referral">Referral</option>
              </select>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {isEditing ? 'Save Changes' : 'Create Lead'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
