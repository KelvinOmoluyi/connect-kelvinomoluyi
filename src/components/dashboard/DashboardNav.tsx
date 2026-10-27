'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/auth/actions';
import { Sparkles, QrCode, UserCog, ExternalLink, LogOut } from 'lucide-react';
import { PublishToggle } from './PublishToggle';

interface DashboardNavProps {
  username: string;
  isPublished: boolean;
}

export function DashboardNav({ username, isPublished }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#07090e]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">
              Link<span className="text-blue-500">Up</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR & Card</span>
            </Link>

            <Link
              href="/dashboard/edit"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                pathname === '/dashboard/edit'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls: live link, publish status, sign out */}
        <div className="flex items-center gap-3">
          <PublishToggle initialPublished={isPublished} />

          <a
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open your public card in a new tab"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors"
          >
            <span>/{username}</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign out of LinkUp"
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
