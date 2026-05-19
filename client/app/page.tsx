'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Users, TrendingUp, BarChart3, Shield, Zap as Rocket } from 'lucide-react';
import SignInModal from '@/components/modals/signin-modal';
import SignUpModal from '@/components/modals/signup-modal';

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-200 to-transparent rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse" />
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-200 to-transparent rounded-full blur-3xl opacity-15 dark:opacity-5" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl opacity-15 dark:opacity-5 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <nav className="relative z-40 backdrop-blur-xl bg-white/50 dark:bg-slate-900/50 border-b border-border/50 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all">
                GF
              </div>
              <span className="hidden sm:inline font-bold text-xl text-foreground">GigFlow</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSignIn(true)}
                className="px-6 py-2.5 rounded-lg text-primary font-semibold hover:bg-primary/5 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="btn-primary text-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8 animate-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="text-sm font-semibold text-primary">Used by 10,000+ sales teams</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                  Accelerate your lead lifecycle with intelligence
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl text-pretty">
                  GigFlow combines AI-powered lead scoring, seamless integrations, and intelligent automation to help your sales team close more deals faster.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in-delay-100">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="btn-primary flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="btn-outline flex items-center justify-center gap-2 group"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground animate-in-delay-200">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Set up in minutes</span>
                </div>
              </div>
            </div>

            {/* Right - Illustration */}
              <div className="relative h-96 md:h-[500px] lg:h-full animate-slide-in-right hidden lg:block">
              <Image
                src="/illustrations/login-hero.jpg"
                alt="GigFlow — Smart Leads Dashboard"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          <div className="text-center space-y-4 animate-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Everything you need to close more deals</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern sales teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-100">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                <Rocket className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time lead synchronization and instant notifications keep your team always in the loop
                </p>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-200">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-secondary/10 transition-all">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">Team Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built-in collaboration tools let your entire team work seamlessly together on leads
                </p>
              </div>
              <div className="flex items-center gap-2 text-secondary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-300">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-all">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intelligent lead scoring helps you prioritize the opportunities that matter most
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-100">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">Advanced Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive dashboards and reports give you full visibility into your sales pipeline
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-200">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Industry-leading security and compliance standards to protect your data
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group card-elevated p-8 space-y-6 animate-in-delay-300">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all">
                <Zap className="w-7 h-7 text-orange-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">API & Integrations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seamlessly integrate with your favorite tools and build custom workflows
                </p>
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-in-delay-200">
            <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to accelerate your growth?</h2>
            <p className="text-xl text-muted-foreground">Join thousands of companies converting more leads with GigFlow</p>
          </div>
          <button
            onClick={() => setShowSignUp(true)}
            className="btn-primary text-lg inline-flex items-center gap-2 group"
          >
            Start your free trial now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/50 backdrop-blur-xl bg-white/30 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-foreground">GigFlow</h4>
                <p className="text-muted-foreground">The modern lead management platform for high-performing sales teams.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Product</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 GigFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Overlays */}
      {showSignIn && <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </>
  );
}
