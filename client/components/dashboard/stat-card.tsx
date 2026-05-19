'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle: string;
  trend: string;
  color: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color,
}: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-soft hover:shadow-glow transition-all hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} to-blue-600 flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
            {trend.includes('↑') ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L13.586 7H12z" clipRule="evenodd" />
              </svg>
            ) : null}
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
