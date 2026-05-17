import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadApi } from '@/api/lead.api';
import { useAuthStore } from '@/store/auth.store';
import { LeadStatus, LeadSource } from '@/types/lead.types';
import type { ILead } from '@/types/lead.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { LeadForm } from './LeadForm';

export function LeadsList() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(sourceFilter && { source: sourceFilter })
    }),
    [page, search, statusFilter, sourceFilter]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadApi.getLeads(filters)
  });

  const deleteMutation = useMutation({
    mutationFn: leadApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
      setIsDeleteDialogOpen(false);
      setLeadToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
      setIsDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-muted-foreground text-sm">View, filter, and manage your sales leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setSelectedLead(undefined); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg border border-border shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search names or emails..."
              className="pl-9"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        <div className="flex gap-2">
          <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            {Object.values(LeadStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}>
            <option value="">All Sources</option>
            {Object.values(LeadSource).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                data?.data.map(lead => {
                  const canEdit = isAdmin || lead.createdBy._id === user?._id;
                  return (
                    <tr key={lead._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{lead.name}</div>
                        <div className="text-muted-foreground text-xs">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{lead.status}</Badge>
                      </td>
                      <td className="px-6 py-4">{lead.source}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                            {lead.createdBy.name?.charAt(0)}
                          </div>
                          <span className="text-xs font-medium">{lead.createdBy.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedLead(lead); setIsFormOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { setLeadToDelete(lead._id); setIsDeleteDialogOpen(true); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, data.pagination.total)}</span> of <span className="font-medium">{data.pagination.total}</span> leads
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page === data.pagination.totalPages} onClick={() => setPage(p => Math.min(data.pagination.totalPages || 1, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedLead ? 'Edit Lead' : 'Create New Lead'} description={selectedLead ? 'Update the details for this lead.' : 'Enter the details for the new lead below.'}>
        <LeadForm initialData={selectedLead} onClose={() => setIsFormOpen(false)} />
      </Dialog>

      <Dialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete Lead" description="Are you sure you want to delete this lead? This action cannot be undone.">
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteMutation.mutate(leadToDelete!)} isLoading={deleteMutation.isPending}>Delete</Button>
        </div>
      </Dialog>
    </div>
  );
}
