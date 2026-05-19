"use client";

import Link from 'next/link';
import { LayoutDashboard, Users, User, LogOut, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuthSession, getStoredUser } from '@/lib/session';
import { logout as apiLogout } from '@/lib/api';
import type { User } from '@/lib/api';

interface SidebarProps {
  open: boolean;
  onToggle: (open: boolean) => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredUser<User>());
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    (async () => {
      try {
        await apiLogout();
      } catch {
        // ignore
      }
      clearAuthSession();
      router.push('/');
    })();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40 transition-opacity"
          onClick={() => onToggle(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-gradient-to-b from-sidebar via-sidebar to-sidebar border-r border-sidebar-border/50 flex flex-col transition-all duration-300 z-50 lg:z-auto shadow-xl lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center shadow-lg text-white font-bold text-lg hover:shadow-xl transition-all duration-300">
            GF
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-sidebar-foreground">GigFlow</h1>
            <p className="text-xs text-muted-foreground">Smart Leads Dashboard</p>
          </div>
          <button
            onClick={() => onToggle(false)}
            className="ml-auto lg:hidden p-2 hover:bg-muted rounded-lg transition-colors text-sidebar-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
              pathname === '/dashboard'
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-semibold hover:from-primary/25 hover:to-primary/10 hover-glow'
                : 'text-sidebar-foreground font-medium hover:bg-sidebar-accent/50 hover:text-primary'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            Dashboard
          </Link>

          <Link
            href="/dashboard-leads"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
              pathname?.startsWith('/dashboard-leads')
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-semibold'
                : 'text-sidebar-foreground font-medium hover:bg-sidebar-accent/50 hover:text-primary'
            }`}
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Leads
          </Link>

          <Link
            href="/dashboard-profile"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
              pathname?.startsWith('/dashboard-profile')
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-semibold'
                : 'text-sidebar-foreground font-medium hover:bg-sidebar-accent/50 hover:text-primary'
            }`}
          >
            <User className="w-5 h-5 group-hover:scale-105 transition-transform" />
            Profile
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border/50 p-4 space-y-3 bg-gradient-to-t from-primary/5 to-transparent">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/60 font-medium transition-all duration-300 group"
          >
            {isDark ? (
              <Sun className="w-5 h-5 group-hover:text-yellow-500 transition-colors" />
            ) : (
              <Moon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
            )}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>

          {/* User Profile Card */}
          <div className="px-4 py-3.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 space-y-3 hover:from-primary/15 hover:to-accent/15 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name || 'GigFlow User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 font-medium transition-all duration-300 group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
