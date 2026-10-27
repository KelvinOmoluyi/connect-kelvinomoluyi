import Link from 'next/link';
import { Sparkles, QrCode, ShieldCheck, Zap, UserPlus } from 'lucide-react';
import { InstantCardBuilder } from '@/components/creator/InstantCardBuilder';

export default function HomePage() {
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

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>No Auth Required</span>
            </div>

            <a
              href="#builder"
              className="text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95"
            >
              Build Your Card
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 pb-24 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-gray-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400">
            Instant Digital Card
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-xs">Enter details & get your scannable QR</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center max-w-4xl leading-[1.1] text-balance">
          Exchange contacts in{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
            seconds.
          </span>
          <br className="hidden sm:inline" /> Not business cards.
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl text-balance leading-relaxed">
          Type your details below and immediately get your event-ready scannable QR sleeve. New connections tap once to save your contact card into their phone.
        </p>

        {/* The Instant Card Builder Container */}
        <div id="builder" className="mt-12 w-full scroll-mt-24">
          <InstantCardBuilder />
        </div>

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
              When someone scans your code, one tap downloads your full contact card directly into their iPhone or Android address book.
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
              You choose whether your phone number and email are public or hidden. Private details are never baked into the QR code.
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
              Download high-resolution PNG (1200px) or scalable SVG to set as your lock screen wallpaper, lanyard badge, or printed card sleeve.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LinkUp. Built for high-impact in-person networking.</p>
          <div className="flex items-center gap-6">
            <a href="#builder" className="hover:text-gray-300 transition-colors">
              Create Card
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
