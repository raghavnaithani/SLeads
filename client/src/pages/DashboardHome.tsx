import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  TrendingUp,
  Users,
  Activity,
  Globe,
  Share2,
  Award,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { leadApi } from '@/api/lead.api';
import { useAuthStore } from '@/store/auth.store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import type { ILead } from '@/types/lead.types';

export function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch up to 100 leads to compute high-fidelity overview analytics
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => leadApi.getLeads({ page: 1, limit: 100 })
  });

  const leads = data?.data || [];

  // Compute analytics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l: ILead) => l.status === 'new').length;
  const contactedLeads = leads.filter((l: ILead) => l.status === 'contacted').length;
  const qualifiedLeads = leads.filter((l: ILead) => l.status === 'qualified').length;
  const lostLeads = leads.filter((l: ILead) => l.status === 'lost').length;

  const activePipeline = newLeads + contactedLeads;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // Source breakdown
  const websiteCount = leads.filter((l: ILead) => l.source === 'website').length;
  const instagramCount = leads.filter((l: ILead) => l.source === 'instagram').length;
  const referralCount = leads.filter((l: ILead) => l.source === 'referral').length;

  const websitePercent = totalLeads > 0 ? Math.round((websiteCount / totalLeads) * 100) : 0;
  const instagramPercent = totalLeads > 0 ? Math.round((instagramCount / totalLeads) * 100) : 0;
  const referralPercent = totalLeads > 0 ? Math.round((referralCount / totalLeads) * 100) : 0;

  // Top 5 recent leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    refetch();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'qualified': return 'success';
      case 'contacted': return 'warning';
      case 'lost': return 'destructive';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dynamic Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/10 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">{user?.name}</span>!
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">
            Here's a premium visual pipeline overview of your sales leads for {format(new Date(), 'MMMM d, yyyy')}.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="bg-card hover:bg-accent border-border"
          disabled={isLoading || isRefetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Sync Live Data
        </Button>
      </div>

      {isLoading ? (
        // Executive Skeletons
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl border border-border bg-card/60 p-6 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Analytics Metric Cards Grid */
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Total Leads */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 dark:bg-card/40 dark:hover:bg-card/60">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Leads</span>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold tracking-tight">{totalLeads}</h3>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                <span className="text-emerald-500 font-bold">100%</span> active database capacity
              </p>
            </div>
          </div>

          {/* Card 2: Active Pipeline */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/20 dark:bg-card/40 dark:hover:bg-card/60">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-500/5 transition-transform duration-500 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Pipeline</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold tracking-tight">{activePipeline}</h3>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                Includes <span className="text-amber-500 font-bold">{newLeads} new</span> and <span className="text-amber-500 font-bold">{contactedLeads} contacted</span>
              </p>
            </div>
          </div>

          {/* Card 3: Conversion Win Rate */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/20 dark:bg-card/40 dark:hover:bg-card/60">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Conversion Win Rate</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-extrabold tracking-tight">{conversionRate}%</h3>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                Targeting <span className="text-emerald-500 font-bold">{qualifiedLeads} qualified</span> deals won
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Distribution visualizers and Recent Activity Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Visual Distribution Column */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm dark:bg-card/30 space-y-6">
          <div>
            <h3 className="font-bold text-lg">Lead Generation Metrics</h3>
            <p className="text-sm text-muted-foreground">Distribution share by active channels and pipeline steps.</p>
          </div>

          {/* Channels Progress */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Acquisition Channels</h4>
            
            {/* Website progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  Website
                </span>
                <span>{websiteCount} leads ({websitePercent}%)</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${websitePercent}%` }} />
              </div>
            </div>

            {/* Instagram progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Share2 className="h-3.5 w-3.5 text-pink-500" />
                  Instagram
                </span>
                <span>{instagramCount} leads ({instagramPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${instagramPercent}%` }} />
              </div>
            </div>

            {/* Referral progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Referral
                </span>
                <span>{referralCount} leads ({referralPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${referralPercent}%` }} />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Stages Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pipeline Stage Totals</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/40">
                <p className="text-xs font-medium text-muted-foreground">New</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{newLeads}</p>
              </div>
              <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/40">
                <p className="text-xs font-medium text-muted-foreground">Contacted</p>
                <p className="text-lg font-bold text-amber-500 mt-0.5">{contactedLeads}</p>
              </div>
              <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/40">
                <p className="text-xs font-medium text-muted-foreground">Qualified</p>
                <p className="text-lg font-bold text-emerald-500 mt-0.5">{qualifiedLeads}</p>
              </div>
              <div className="p-3 bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/40">
                <p className="text-xs font-medium text-muted-foreground">Lost</p>
                <p className="text-lg font-bold text-rose-500 mt-0.5">{lostLeads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Column */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm dark:bg-card/30 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Recent Sales Pipeline Activity</h3>
                <p className="text-sm text-muted-foreground">Fresh records recently captured or modified in the database.</p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 w-full bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm font-medium">
                No active pipeline leads found. Create some leads first!
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentLeads.map(lead => (
                  <div key={lead._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        {getInitials(lead.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                          {lead.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{lead.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(lead.status)} className="capitalize px-2 py-0.5 text-[10px]">
                        {lead.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">
                        {format(new Date(lead.createdAt), 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate('/dashboard/leads')}
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/95 group font-medium"
          >
            Manage Leads Directory
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
