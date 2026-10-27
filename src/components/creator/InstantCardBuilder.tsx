'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardTheme, SocialPlatform, ProfileLink, PublicProfileData } from '@/lib/types';
import { saveCard, isHandleTaken, getLocalEditKey } from '@/lib/firebase/card-service';
import { isReservedUsername, validateUsernameFormat } from '@/lib/reserved-usernames';
import { QRCard } from '@/components/qr/QRCard';
import { PublicProfileView } from '@/components/profile/PublicProfileView';
import {
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  Building2,
  FileText,
  Phone,
  Mail,
  Palette,
  Plus,
  Trash2,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  QrCode,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstantCardBuilderProps {
  initialUsername?: string;
  existingData?: PublicProfileData | null;
}

export function InstantCardBuilder({
  initialUsername = '',
  existingData = null,
}: InstantCardBuilderProps) {
  const router = useRouter();

  // Form State
  const [username, setUsername] = useState(
    existingData?.username || initialUsername.toLowerCase().replace(/[^a-z0-9_-]/g, '') || ''
  );
  const [fullName, setFullName] = useState(existingData?.full_name || '');
  const [headline, setHeadline] = useState(existingData?.headline || '');
  const [company, setCompany] = useState(existingData?.company || '');
  const [bio, setBio] = useState(existingData?.bio || '');
  const [phone, setPhone] = useState(existingData?.phone || '');
  const [email, setEmail] = useState(existingData?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(existingData?.avatar_url || '');
  const [theme, setTheme] = useState<CardTheme>(existingData?.theme || 'cobalt');

  // Visibility flags
  const [showPhone, setShowPhone] = useState(existingData?.show_phone ?? true);
  const [showEmail, setShowEmail] = useState(existingData?.show_email ?? true);
  const [showCompany, setShowCompany] = useState(existingData?.show_company ?? true);

  // Social Links
  const [links, setLinks] = useState<ProfileLink[]>(
    existingData?.links || [
      {
        id: '1',
        profile_id: 'temp',
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://linkedin.com',
        is_active: true,
        sort_order: 0,
      },
      {
        id: '2',
        profile_id: 'temp',
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com',
        is_active: true,
        sort_order: 1,
      },
    ]
  );

  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('website');
  const [newLabel, setNewLabel] = useState('Website');
  const [newUrl, setNewUrl] = useState('');

  // UI state
  const [previewMode, setPreviewMode] = useState<'sleeve' | 'visitor'>('sleeve');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(Boolean(existingData));
  const [copiedLink, setCopiedLink] = useState(false);
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const canonicalUrl = username ? `${originUrl}/${username}` : `${originUrl}/yourname`;

  // Live profile data object for real-time preview
  const liveProfileData: PublicProfileData = {
    id: username || 'preview',
    username: username || 'yourname',
    full_name: fullName.trim() || 'Your Name',
    headline: headline.trim() || 'Professional Headline',
    company: showCompany && company.trim() ? company.trim() : null,
    bio: bio.trim() || null,
    phone: showPhone && phone.trim() ? phone.trim() : null,
    email: showEmail && email.trim() ? email.trim() : null,
    avatar_url: avatarUrl.trim() || null,
    show_phone: showPhone,
    show_email: showEmail,
    show_company: showCompany,
    is_published: true,
    theme,
    links,
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;
    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLinks((prev) => [
      ...prev,
      {
        id: `link-${Date.now()}`,
        profile_id: username || 'temp',
        platform: newPlatform,
        label: newLabel,
        url: formattedUrl,
        is_active: true,
        sort_order: prev.length,
      },
    ]);
    setNewUrl('');
  };

  const handleRemoveLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setErrorMsg('Please choose a handle for your card link.');
      return;
    }

    const validation = validateUsernameFormat(cleanUsername);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid handle format.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if handle is claimed by someone else (unless it's our own card with stored editKey)
      const existingKey = getLocalEditKey(cleanUsername);
      if (!existingKey) {
        const taken = await isHandleTaken(cleanUsername);
        if (taken) {
          setErrorMsg('This handle is already claimed. Please pick a different one.');
          setIsSubmitting(false);
          return;
        }
      }

      const res = await saveCard({
        id: cleanUsername,
        username: cleanUsername,
        full_name: fullName.trim(),
        headline: headline.trim() || null,
        company: company.trim() || null,
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        theme,
        show_phone: showPhone,
        show_email: showEmail,
        show_company: showCompany,
        is_published: true,
        links,
        editKey: existingKey || undefined,
      });

      if (res.success) {
        setIsCreated(true);
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0052ff', '#3b82f6', '#60a5fa', '#38bdf8'],
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMsg(res.error || 'Failed to save card. Please try again.');
      }
    } catch (err: unknown) {
      setErrorMsg('An error occurred while creating your card.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* If Card Just Created: Success Callout with QR Export */}
      {isCreated && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-950/40 to-slate-900/40 border border-blue-500/40 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Card is Live & Scannable</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Your networking card is ready!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Show this QR sleeve to people at events, or share your permanent link. Changes save instantly without re-printing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
              >
                <span>Open Public Card</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsCreated(false)}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium text-xs sm:text-sm transition-colors"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleGenerateCard} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Handle & Name */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <AtSign className="w-4 h-4 text-blue-400" />
                <span>Card Handle & Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-gray-300">
                      Your Handle *
                    </label>
                    <span className="text-[10px] font-mono text-gray-400">
                      linkup.to/{username || '...'}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <AtSign className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="alexrivera"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Professional Headline
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Founder & Principal Architect"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Company & Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Company or Project
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Studio North"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Show Company
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCompany(!showCompany)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      showCompany
                        ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {showCompany ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{showCompany ? 'Public' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Short Bio (Met at events note)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-gray-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Building next-gen developer tools. Let's talk AI and systems architecture."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Direct Channels (WhatsApp & Email) */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Direct Contact Channels</span>
                </h3>
                <span className="text-[11px] font-mono text-gray-400">Controls vCard & Actions</span>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Phone Number (with Country Code)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 382-9104"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">Enables direct WhatsApp and one-tap dialing</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    WhatsApp Action
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      showPhone
                        ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {showPhone ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{showPhone ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Direct Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@studionorth.dev"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Email Action
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      showEmail
                        ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {showEmail ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{showEmail ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sleeve Theme Selection */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Card & Sleeve Style</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('cobalt')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    theme === 'cobalt'
                      ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="w-full h-6 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-900 mb-2" />
                  <div className="font-semibold text-xs text-white">Royal Cobalt</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('obsidian')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    theme === 'obsidian'
                      ? 'bg-slate-900/80 border-slate-400 ring-2 ring-slate-400/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="w-full h-6 rounded-lg bg-gradient-to-r from-zinc-800 to-black mb-2" />
                  <div className="font-semibold text-xs text-white">Obsidian</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('minimal-light')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    theme === 'minimal-light'
                      ? 'bg-white/15 border-white ring-2 ring-white/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="w-full h-6 rounded-lg bg-gradient-to-r from-gray-200 to-white mb-2" />
                  <div className="font-semibold text-xs text-white">Minimal Light</div>
                </button>
              </div>
            </div>

            {/* Social Links Manager */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Links & Socials</span>
                </h3>
                <span className="text-[11px] font-mono text-gray-400">{links.length} attached</span>
              </div>

              {links.length > 0 && (
                <div className="space-y-2">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="overflow-hidden pr-2">
                        <span className="text-xs font-medium text-white block truncate">{link.label}</span>
                        <span className="text-[11px] font-mono text-gray-400 block truncate">{link.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add link mini row */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <select
                  value={newPlatform}
                  onChange={(e) => {
                    const p = e.target.value as SocialPlatform;
                    setNewPlatform(p);
                    setNewLabel(p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1));
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="website" className="bg-[#0e121c]">Personal Website</option>
                  <option value="linkedin" className="bg-[#0e121c]">LinkedIn</option>
                  <option value="github" className="bg-[#0e121c]">GitHub</option>
                  <option value="x" className="bg-[#0e121c]">X (Twitter)</option>
                  <option value="instagram" className="bg-[#0e121c]">Instagram</option>
                  <option value="youtube" className="bg-[#0e121c]">YouTube</option>
                  <option value="custom" className="bg-[#0e121c]">Custom</option>
                </select>

                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newUrl}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-base transition-all shadow-[0_15px_30px_rgba(0,82,255,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating your card & QR code...</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{isCreated ? 'Update Card & QR' : 'Generate My Card & QR Code'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Live Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full sticky top-24 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
                Live Interactive Preview
              </span>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewMode('sleeve')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    previewMode === 'sleeve'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3 h-3" />
                  <span>QR Sleeve</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('visitor')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    previewMode === 'visitor'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Visitor Card</span>
                </button>
              </div>
            </div>

            {previewMode === 'sleeve' ? (
              <div className="w-full flex justify-center pt-2">
                <QRCard
                  url={canonicalUrl}
                  username={username || 'yourname'}
                  fullName={fullName.trim() || 'Your Name'}
                  headline={headline.trim() || 'Professional Headline'}
                  company={company.trim() || null}
                  theme={theme}
                  showActions={isCreated}
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[340px] mx-auto rounded-[38px] p-2.5 bg-gradient-to-b from-gray-800 to-gray-950 border-4 border-gray-700/60 shadow-2xl overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-3.5 rounded-full bg-black z-30" />
                <div className="w-full rounded-[30px] overflow-hidden bg-[#090b10] border border-white/5 max-h-[580px] overflow-y-auto pt-4">
                  <PublicProfileView profile={liveProfileData} canonicalUrl={canonicalUrl} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
