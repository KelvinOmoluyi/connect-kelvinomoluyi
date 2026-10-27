import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { CompletionIndicator } from '@/components/dashboard/CompletionIndicator';
import { PhoneSimulator } from '@/components/dashboard/PhoneSimulator';
import { ProfileWithLinks, ProfileLink } from '@/lib/types';
import {
  UserCog,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const instant = false;


export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch complete profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/dashboard/edit');
  }

  // Fetch user links
  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', user.id)
    .order('sort_order', { ascending: true });

  const profileWithLinks: ProfileWithLinks = {
    ...profile,
    links: (links as ProfileLink[]) || [],
  };

  // Determine canonical URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  const canonicalUrl = `${appUrl}/${profile.username}`;

  return (
    <div className="space-y-8">
      {/* 1. Profile Completion Tracker */}
      <CompletionIndicator profile={profileWithLinks} />

      {/* 2. Main Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Event QR Card, Details & Action Panels (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Meta & Edit Header */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-mono text-gray-400">
                  Digital Card
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs font-mono text-blue-400">
                  /{profile.username}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {profile.full_name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile.headline || 'No professional headline set yet'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/edit"
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>

              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                title="Open public profile"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Canonical QR Overview */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Event-Ready Scannable Code
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Point any phone camera to save your contact card
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Private & Secure</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Your QR code encodes solely your canonical profile link (<code className="text-gray-300 font-mono">{canonicalUrl}</code>).
              Personal email and phone numbers are never embedded directly in the QR pattern, allowing you to update contact information at any time without reprinting.
            </p>

            {/* Configured Contact Channels Summary */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[10px] font-mono uppercase text-gray-500">
                  Phone / WhatsApp
                </span>
                <span className="text-xs font-medium text-white truncate block mt-0.5">
                  {profile.show_phone && profile.phone ? profile.phone : 'Not shared publicly'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[10px] font-mono uppercase text-gray-500">
                  Email
                </span>
                <span className="text-xs font-medium text-white truncate block mt-0.5">
                  {profile.show_email && profile.email ? profile.email : 'Not shared publicly'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="block text-[10px] font-mono uppercase text-gray-500">
                  Social Links
                </span>
                <span className="text-xs font-medium text-white truncate block mt-0.5">
                  {profileWithLinks.links.length} Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Interactive Simulator (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full">
            <div className="mb-4 text-center sm:text-left">
              <h3 className="text-base font-semibold text-white">
                Live Card & QR Sleeve
              </h3>
              <p className="text-xs text-gray-400">
                Toggle between your in-person sleeve and public visitor card
              </p>
            </div>
            <PhoneSimulator profile={profileWithLinks} canonicalUrl={canonicalUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
