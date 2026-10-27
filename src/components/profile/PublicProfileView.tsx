'use client';

import React, { useState } from 'react';
import { PublicProfileData } from '@/lib/types';
import { downloadVCard, getWhatsAppUrl } from '@/lib/vcard';
import {
  UserPlus,
  Mail,
  MessageCircle,
  Share2,
  Globe,
  ExternalLink,
  Check,
  QrCode,
  Sparkles,
  Building2,
  X as CloseIcon,
} from 'lucide-react';
import {
  LinkedInIcon,
  GitHubIcon,
  XIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/ui/Icons';
import confetti from 'canvas-confetti';
import { QRCard } from '@/components/qr/QRCard';

interface PublicProfileViewProps {
  profile: PublicProfileData;
  canonicalUrl: string;
}

export function PublicProfileView({
  profile,
  canonicalUrl,
}: PublicProfileViewProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [savedContact, setSavedContact] = useState(false);

  const handleSaveContact = () => {
    downloadVCard(profile, canonicalUrl);
    setSavedContact(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0052ff', '#3b82f6', '#60a5fa', '#93c5fd'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setSavedContact(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name} — LinkUp`,
          text: `Save contact info for ${profile.full_name}`,
          url: canonicalUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />;
      case 'github':
        return <GitHubIcon className="w-4 h-4 text-white" />;
      case 'x':
        return <XIcon className="w-4 h-4 text-gray-200" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-[#e4405f]" />;
      case 'youtube':
        return <YouTubeIcon className="w-4 h-4 text-[#ff0000]" />;
      case 'website':
      default:
        return <Globe className="w-4 h-4 text-blue-400" />;
    }
  };

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const themeStyles = {
    cobalt: {
      card: 'bg-[#0c1220]/90 border-blue-900/30 text-white',
      glow: 'bg-blue-600/20',
      avatarRing: 'ring-blue-500/50',
    },
    obsidian: {
      card: 'bg-[#0e1118]/90 border-white/10 text-white',
      glow: 'bg-indigo-600/15',
      avatarRing: 'ring-white/20',
    },
    'minimal-light': {
      card: 'bg-white/95 border-gray-200 text-gray-900 shadow-xl',
      glow: 'bg-blue-400/10',
      avatarRing: 'ring-gray-300',
    },
  }[profile.theme || 'cobalt'];

  const whatsappUrl =
    profile.show_phone && profile.phone
      ? getWhatsAppUrl(profile.phone, profile.full_name)
      : '';

  const emailUrl =
    profile.show_email && profile.email
      ? `mailto:${profile.email}?subject=${encodeURIComponent(
          `Connecting with ${profile.full_name} via LinkUp`
        )}`
      : '';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 sm:py-12">
      {/* Dynamic Ambient Background Glow inspired by reference image 2 */}
      <div
        className={`ambient-glow w-[380px] h-[380px] -top-20 left-1/2 -translate-x-1/2 ${themeStyles.glow}`}
      />
      <div
        className={`ambient-glow w-[300px] h-[300px] bottom-10 left-1/2 -translate-x-1/2 bg-blue-700/15`}
      />

      {/* Main Profile Card Container */}
      <div className="w-full max-w-md mx-auto z-10 flex flex-col">
        <div
          className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border shadow-2xl transition-all ${themeStyles.card}`}
        >
          {/* Top Bar / Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider uppercase opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LinkUp Card</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQRModal(true)}
                title="View QR Code"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                aria-label="View QR Code"
              >
                <QrCode className="w-4 h-4 opacity-80 hover:opacity-100" />
              </button>

              <button
                onClick={handleShare}
                title="Share Card"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                aria-label="Share profile"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4 opacity-80 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Profile Identity (Name, Photo, Headline) */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ${themeStyles.avatarRing} shadow-xl`}
                />
              ) : (
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ${themeStyles.avatarRing} bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 flex items-center justify-center text-2xl font-bold tracking-wider text-white shadow-xl`}
                >
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-[#0c1220] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Full Name */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {profile.full_name}
            </h1>

            {/* Headline */}
            {profile.headline && (
              <p className="mt-1 text-sm sm:text-base font-normal opacity-85 leading-snug max-w-xs">
                {profile.headline}
              </p>
            )}

            {/* Company Badge */}
            {profile.show_company && profile.company && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium opacity-90">
                <Building2 className="w-3.5 h-3.5 opacity-70" />
                <span>{profile.company}</span>
              </div>
            )}

            {/* Short Bio */}
            {profile.bio && (
              <p className="mt-3.5 text-xs sm:text-sm opacity-70 leading-relaxed max-w-sm text-balance">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Priority Action 1: Save Contact (One-Tap vCard) */}
          <div className="mt-6">
            <button
              onClick={handleSaveContact}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-medium text-sm sm:text-base shadow-[0_10px_25px_rgba(0,82,255,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {savedContact ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Contact Downloaded!</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Save Contact</span>
                </>
              )}
            </button>
          </div>

          {/* Priority Quick Actions: WhatsApp & Email */}
          {(whatsappUrl || emailUrl) && (
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-medium transition-all hover:border-emerald-500/40 text-emerald-400"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              ) : (
                <div className="hidden" />
              )}

              {emailUrl ? (
                <a
                  href={emailUrl}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-medium transition-all hover:border-blue-500/40 text-blue-300"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              ) : (
                <div className="hidden" />
              )}
            </div>
          )}

          {/* Social Links & Web Profiles */}
          {profile.links && profile.links.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider opacity-50 px-1 mb-1">
                Social & Links
              </span>
              {profile.links
                .filter((l) => l.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/20 group-hover:scale-105 transition-transform">
                        {getPlatformIcon(link.platform)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium tracking-wide">
                        {link.label}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Footer Brand Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <span>Powered by</span>
            <span className="font-semibold text-blue-400">LinkUp</span>
          </a>
        </div>
      </div>

      {/* QR Code Modal Drawer for in-person instant scans */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0e121c] border border-white/10 p-6 shadow-2xl">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-white">
                Scan to Save Contact
              </h3>
              <p className="text-xs text-gray-400">
                Point any phone camera to save {profile.full_name}&apos;s card
              </p>
            </div>

            <QRCard
              url={canonicalUrl}
              username={profile.username}
              fullName={profile.full_name}
              headline={profile.headline}
              company={profile.company}
              theme={profile.theme}
              showActions={false}
            />

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
