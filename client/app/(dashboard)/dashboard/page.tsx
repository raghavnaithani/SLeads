'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Download, Plus, Search, TrendingUp, Users } from 'lucide-react';
import LeadsModal from '@/components/dashboard/leads-modal';
import StatCard from '@/components/dashboard/stat-card';
import { exportLeadsCsv, getLeads, type Lead } from '@/lib/api';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(
    () => ({
      page: 1,
      limit: 50,
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      ...(filterStatus !== 'all' ? { status: filterStatus } : {}),
      sort: 'latest' as const,
    }),
    [searchTerm, filterStatus],
  );

  useEffect(() => {
    let active = true;

    const loadLeads = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getLeads(query);
        if (active) {
          setLeads(result.leads);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLeads();

    return () => {
      active = false;
    };
  }, [query]);

  const totalLeads = leads.length;
  const activePipeline = leads.filter((lead) => ['new', 'contacted'].includes(lead.status)).length;
  const conversionRate = totalLeads ? Math.round((leads.filter((lead) => lead.status === 'qualified').length / totalLeads) * 100) : 0;

  const handleExport = async () => {
    const blob = await exportLeadsCsv({
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      ...(filterStatus !== 'all' ? { status: filterStatus } : {}),
      sort: 'latest',
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'leads_export.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">View your overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Leads"
          value={String(totalLeads)}
          icon={Users}
          subtitle="Live from backend"
          trend="Updated automatically"
          color="from-primary"
        />
        <StatCard
          title="Active Pipeline"
          value={String(activePipeline)}
          icon={Activity}
          subtitle="New and contacted leads"
          trend="Backend data"
          color="from-orange-500"
        />
        <StatCard
          title="Conversion Win Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          subtitle="Qualified leads / total leads"
          trend="Calculated live"
          color="from-secondary"
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-4 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search names or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setFilterStatus('all')}
            className="px-4 py-2.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-medium transition-all flex items-center gap-2"
          >
            Search
          </button>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>

          <select className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Source</option>
            <option>website</option>
            <option>instagram</option>
            <option>referral</option>
          </select>

          <select className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Latest</option>
            <option>Oldest</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleExport}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-semibold transition-all flex items-center gap-2 shadow-soft hover:shadow-glow"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create New Lead
          </button>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-red-600">{error}</td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading leads...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No leads found matching your criteria.</td>
                  </tr>
                ) : (
                  leads.slice(0, 5).map((lead) => (
                    <tr key={lead._id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{lead.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{lead.status}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{lead.source}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <LeadsModal
          onClose={() => setShowModal(false)}
          onSaved={async () => {
            const result = await getLeads(query);
            setLeads(result.leads);
          }}
        />
      )}
    </div>
  );
}
