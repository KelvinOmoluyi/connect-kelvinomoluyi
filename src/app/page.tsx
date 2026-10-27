'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  QrCode,
  UserPlus,
  ShieldCheck,
  Zap,
  Smartphone,
  Share2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { QRCard } from '@/components/qr/QRCard';

export default function LandingPage() {
  const router = useRouter();
  const [handleInput, setHandleInput] = useState('');
  const [activeTab, setActiveTab] = useState<'sleeve' | 'profile'>('sleeve');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-gray-100 flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient Radial Gradient Glows (Reference Image 2 Inspired) */}
      <div className="ambient-glow w-[500px] h-[500px] -top-32 -left-20 bg-blue-600/15" />
      <div className="ambient-glow w-[600px] h-[600px] top-1/3 -right-40 bg-indigo-600/10" />
      <div className="ambient-glow w-[500px] h-[500px] bottom-0 left-1/3 bg-blue-500/10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#07090e]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg sm:text-xl text-white">
              Link<span className="text-blue-500">Up</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-12 pb-24 sm:pt-20 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-gray-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400">
            Next-Gen Networking
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-xs">No app install required</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center max-w-4xl leading-[1.1] text-balance">
          Exchange contacts in{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            seconds.
          </span>
          <br className="hidden sm:inline" /> Not business cards.
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl text-balance leading-relaxed">
          Create your sleek digital profile, generate an in-person scannable QR card,
          and let new connections download your contact card directly to their phone with one tap.
        </p>

        {/* Claim Your Handle Input */}
        <form
          onSubmit={handleClaim}
          className="mt-8 w-full max-w-md p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center shadow-2xl focus-within:border-blue-500/60 transition-all"
        >
          <div className="flex items-center pl-3.5 text-gray-500 font-mono text-xs sm:text-sm select-none">
            linkup.to/
          </div>
          <input
            type="text"
            value={handleInput}
            onChange={(e) => setHandleInput(e.target.value)}
            placeholder="yourname"
            className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-gray-600 focus:outline-none font-medium"
          />
          <button
            type="submit"
            className="py-2.5 px-4 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0 shadow-lg shadow-blue-600/30"
          >
            <span>Claim Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Interactive Showcase Preview (Reference Images 1 & 2 Aesthetic) */}
        <section className="mt-16 sm:mt-20 w-full max-w-4xl flex flex-col items-center">
          {/* Preview View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('sleeve')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'sleeve'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              In-Person QR Sleeve
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Public Profile View
            </button>
          </div>

          {/* Interactive Card Presentation Container */}
          <div className="relative w-full flex justify-center items-center">
            {activeTab === 'sleeve' ? (
              <div className="animate-in fade-in zoom-in-95 duration-300 w-full flex justify-center">
                <QRCard
                  url="https://linkup.app/alexrivera"
                  username="alexrivera"
                  fullName="Alex Rivera"
                  headline="Founder & Principal Architect"
                  company="Studio North"
                  theme="cobalt"
                  showActions={true}
                />
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300 w-full max-w-sm rounded-3xl p-6 glass-card border border-white/10 shadow-2xl">
                {/* Mock Phone Notch & Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-gray-400 uppercase">
                      Visitor Preview
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">linkup.app/alexrivera</span>
                </div>

                {/* Identity */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 ring-4 ring-blue-500/40 flex items-center justify-center text-xl font-bold text-white shadow-xl mb-3">
                    AR
                  </div>
                  <h3 className="text-xl font-bold text-white">Alex Rivera</h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Founder & Principal Architect
                  </p>
                  <span className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
                    Studio North
                  </span>
                </div>

                {/* Simulated Action */}
                <div className="mt-5">
                  <div className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                    <UserPlus className="w-4 h-4" />
                    <span>Save Contact to Phone (.vcf)</span>
                  </div>
                </div>

                {/* Micro Buttons */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-emerald-400 text-center">
                    WhatsApp Chat
                  </div>
                  <div className="py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-blue-300 text-center">
                    Direct Email
                  </div>
                </div>

                {/* Social Pills */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-gray-300">
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-gray-300">
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="mt-28 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col items-start hover:border-white/20 transition-all">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 mb-4 border border-blue-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Instant Contact Card (.vcf)
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              When someone scans your code, one tap downloads your full contact profile directly into their iPhone or Android address book.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col items-start hover:border-white/20 transition-all">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Granular Privacy Controls
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              You stay in control. Choose exactly which contact channels (phone, email, socials) are visible publicly and included in the vCard.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col items-start hover:border-white/20 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 mb-4 border border-emerald-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              High-Res Vector Export
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Export high-contrast PNG or SVG QR codes formatted for phone wallpaper, badge lanyards, pitch decks, or printed physical card sleeves.
            </p>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-28 w-full p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="ambient-glow w-64 h-64 -top-20 -right-20 bg-blue-500/20" />
          <div className="z-10 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready for your next event?
            </h3>
            <p className="text-sm text-gray-300 mt-1 max-w-md">
              Set up your card in 60 seconds and start networking without paper waste.
            </p>
          </div>
          <Link
            href="/signup"
            className="z-10 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2 shrink-0"
          >
            <span>Create Your Free Card</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LinkUp. Built for high-impact in-person networking.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-gray-300 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-gray-300 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
