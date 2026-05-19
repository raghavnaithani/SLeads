'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, X, CheckCircle } from 'lucide-react';
import { register } from '@/lib/api';
import { setAuthSession } from '@/lib/session';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, user } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setAuthSession(token, user);
      router.push('/dashboard');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 lg:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-cyan-500 bg-clip-text text-transparent">
            Create your account
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-muted-foreground">Join 10,000+ companies managing leads smarter</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all duration-300 input-focus-animation"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all duration-300 input-focus-animation"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all duration-300 input-focus-animation pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 text-sm p-4 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Password requirements</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground text-sm">At least 8 characters</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground text-sm">One uppercase letter</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground text-sm">One number</span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-6">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border accent-secondary mt-0.5"
                required
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                I agree to the{' '}
                <a href="#" className="text-secondary font-semibold hover:underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-secondary font-semibold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.terms}
              className="w-full btn-primary group relative flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="font-semibold text-secondary hover:text-secondary/80 transition-colors"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
