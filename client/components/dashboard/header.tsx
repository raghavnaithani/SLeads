'use client';

import { Menu, User, LogOut, Sun, Moon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthSession, getStoredUser } from '@/lib/session';
import { logout as apiLogout } from '@/lib/api';
import type { User } from '@/lib/api';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser<User>());
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const handleLogout = () => {
    // call server to revoke token, then clear client session
    (async () => {
      try {
        await apiLogout();
      } catch {
        // ignore server logout errors
      }
      clearAuthSession();
      router.push('/');
    })();
  };

  return (
    <header className="h-16 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-b border-border/50 flex items-center justify-between px-4 md:px-8 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      {/* Left side - Menu & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-all duration-300 text-foreground hover-glow"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>

      {/* Center - Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-sm items-center gap-3 mx-8 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 transition-all duration-300">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search leads, deals..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center gap-2 md:gap-3">


        {/* (removed standalone Settings button) */}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            setDarkMode(!darkMode);
            if (!darkMode) {
              document.documentElement.classList.add('dark');
              localStorage.setItem('theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('theme', 'light');
            }
          }}
          className="p-2.5 rounded-lg hover:bg-muted transition-all duration-300 group hover-glow"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
          )}
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-border/50"></div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all">
              {(user?.name || 'GF').slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <p className="text-sm font-semibold text-foreground leading-none">{user?.name || 'GigFlow User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'admin'}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground">{user?.name || 'GigFlow User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'Signed in'}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfile(false);
                  router.push('/dashboard-profile');
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-foreground font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <button className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-foreground font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Support
              </button>

              <div className="h-px bg-border/50 my-2"></div>

              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-destructive/10 transition-colors text-destructive font-medium flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
