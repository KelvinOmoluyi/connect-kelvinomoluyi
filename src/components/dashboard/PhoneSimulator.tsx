'use client';

import React, { useState } from 'react';
import { ProfileWithLinks, PublicProfileData } from '@/lib/types';
import { PublicProfileView } from '@/components/profile/PublicProfileView';
import { QRCard } from '@/components/qr/QRCard';
import { Smartphone, QrCode } from 'lucide-react';

interface PhoneSimulatorProps {
  profile: ProfileWithLinks;
  canonicalUrl: string;
}

export function PhoneSimulator({ profile, canonicalUrl }: PhoneSimulatorProps) {
  const [mode, setMode] = useState<'profile' | 'qr'>('qr');

  const publicData: PublicProfileData = {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    headline: profile.headline,
    bio: profile.bio,
    company: profile.show_company ? profile.company : null,
    phone: profile.show_phone ? profile.phone : null,
    email: profile.show_email ? profile.email : null,
    avatar_url: profile.avatar_url,
    show_phone: profile.show_phone,
    show_email: profile.show_email,
    show_company: profile.show_company,
    is_published: profile.is_published,
    theme: profile.theme || 'cobalt',
    links: profile.links || [],
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
        <button
          onClick={() => setMode('qr')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            mode === 'qr'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Sleeve</span>
        </button>
        <button
          onClick={() => setMode('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            mode === 'profile'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Visitor View</span>
        </button>
      </div>

      {mode === 'qr' ? (
        <div className="w-full max-w-sm">
          <QRCard
            url={canonicalUrl}
            username={profile.username}
            fullName={profile.full_name}
            headline={profile.headline}
            company={profile.company}
            theme={profile.theme}
            showActions={true}
          />
        </div>
      ) : (
        /* Sleek Smartphone Mockup Wrapper */
        <div className="relative w-full max-w-[360px] rounded-[42px] p-3 bg-gradient-to-b from-gray-800 to-gray-950 border-4 border-gray-700/60 shadow-2xl overflow-hidden">
          {/* Speaker / Camera Island notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Screen Content */}
          <div className="w-full rounded-[34px] overflow-hidden bg-[#090b10] border border-white/5 max-h-[640px] overflow-y-auto pt-5">
            <PublicProfileView profile={publicData} canonicalUrl={canonicalUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
