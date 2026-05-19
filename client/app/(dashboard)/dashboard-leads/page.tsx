'use client';

import { useEffect, useMemo, useState } from 'react';
import useDebounce from '@/lib/hooks/useDebounce';
import { Download, Edit, Eye, Filter, Mail, Plus, Search, Trash2 } from 'lucide-react';
import LeadsModal from '@/components/dashboard/leads-modal';
import { deleteLead, exportLeadsCsv, getLeads, type Lead } from '@/lib/api';
import { getStoredUser } from '@/lib/session';
import type { User } from '@/lib/api';

type StatusFilter = 'all' | 'new' | 'contacted' | 'qualified' | 'lost';
type SourceFilter = 'all' | 'website' | 'instagram' | 'referral';
type SortFilter = 'latest' | 'oldest';

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortFilter, setSortFilter] = useState<SortFilter>('latest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 350);

  const query = useMemo(() => ({
    page,
    limit: 10,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    ...(sourceFilter !== 'all' ? { source: sourceFilter } : {}),
    sort: sortFilter,
  }), [page, debouncedSearch, statusFilter, sourceFilter, sortFilter]);

  const loadLeads = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getLeads(query);
      setLeads(result.leads);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    setCurrentUser(typeof window !== 'undefined' ? getStoredUser<User>() : null);
  }, [query]);

  const handleExportCsv = async () => {
    const blob = await exportLeadsCsv({
      ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(sourceFilter !== 'all' ? { source: sourceFilter } : {}),
      sort: sortFilter,
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'leads_export.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);

    try {
      await deleteLead(id);
      await loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setDeleteId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'contacted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = leads.length ? `$${Math.round(leads.length * 25000).toLocaleString()}` : '$0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads Management</h1>
        <p className="text-muted-foreground mt-2">View, filter, and manage your sales leads.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="card-elevated p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-cyan-600">Live from backend</p>
        </div>
        <div className="card-elevated p-6 space-y-2">
          <p className="text-sm text-muted-foreground">New</p>
          <p className="text-3xl font-bold text-foreground">{leads.filter((l) => l.status === 'new').length}</p>
          <p className="text-xs text-cyan-600">Awaiting contact</p>
        </div>
        <div className="card-elevated p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Qualified</p>
          <p className="text-3xl font-bold text-foreground">{leads.filter((l) => l.status === 'qualified').length}</p>
          <p className="text-xs text-cyan-600">Ready to close</p>
        </div>
        <div className="card-elevated p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-3xl font-bold text-foreground">{totalValue}</p>
          <p className="text-xs text-cyan-600">Estimated pipeline</p>
        </div>
      </div>

      <div className="card-elevated p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search names or emails..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>

          <button className="px-4 py-2.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-medium transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value as SourceFilter);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Source</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="referral">Referral</option>
          </select>

          <select
            value={sortFilter}
            onChange={(e) => {
              setSortFilter(e.target.value as SortFilter);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleExportCsv}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-semibold transition-all flex items-center gap-2 shadow-soft hover:shadow-glow"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => {
              setSelectedLead(null);
              setShowModal(true);
            }}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create New Lead
          </button>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Created By</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-red-600">{error}</td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No leads found matching your criteria.</p>
                      <p className="text-sm text-muted-foreground">Create your first lead to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {typeof lead.createdBy === 'string' ? lead.createdBy : lead.createdBy.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(lead._id)}
                            disabled={deleteId === lead._id}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {leads.length} of {total} leads
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className="text-xs px-3 py-1 rounded bg-slate-100 dark:bg-slate-800">Page {page}</span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <LeadsModal
          lead={selectedLead}
          onClose={() => {
            setShowModal(false);
            setSelectedLead(null);
          }}
          onSaved={loadLeads}
        />
      )}
    </div>
  );
}
