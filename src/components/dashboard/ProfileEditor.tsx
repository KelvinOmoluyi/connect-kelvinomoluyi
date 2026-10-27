'use client';

import React, { useActionState, useState, useTransition } from 'react';
import { ProfileWithLinks, CardTheme, SocialPlatform, ProfileLink } from '@/lib/types';
import {
  updateProfileAction,
  saveProfileLinkAction,
  deleteProfileLinkAction,
  ActionResponse,
} from '@/app/dashboard/actions';
import {
  User,
  Building2,
  Briefcase,
  FileText,
  Phone,
  Mail,
  Image as ImageIcon,
  Palette,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Save,
} from 'lucide-react';
import {
  LinkedInIcon,
  GitHubIcon,
  XIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/ui/Icons';

interface ProfileEditorProps {
  profile: ProfileWithLinks;
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [profileState, formAction, isProfilePending] = useActionState<ActionResponse | null, FormData>(
    updateProfileAction,
    null
  );

  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(profile.theme || 'cobalt');
  const [showPhone, setShowPhone] = useState(profile.show_phone);
  const [showEmail, setShowEmail] = useState(profile.show_email);
  const [showCompany, setShowCompany] = useState(profile.show_company);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  // Links management state
  const [links, setLinks] = useState<ProfileLink[]>(profile.links || []);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('linkedin');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isLinkPending, startLinkTransition] = useTransition();
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;

    startLinkTransition(async () => {
      const res = await saveProfileLinkAction({
        platform: newPlatform,
        label: newLabel,
        url: newUrl,
        is_active: true,
        sort_order: links.length,
      });

      if (res.success) {
        setLinkMessage('Link added successfully.');
        setLinks((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            profile_id: profile.id,
            platform: newPlatform,
            label: newLabel,
            url: newUrl,
            is_active: true,
            sort_order: prev.length,
          },
        ]);
        setNewLabel('');
        setNewUrl('');
        setTimeout(() => setLinkMessage(null), 3000);
      }
    });
  };

  const handleDeleteLink = (linkId: string) => {
    startLinkTransition(async () => {
      const res = await deleteProfileLinkAction(linkId);
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== linkId));
      }
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />;
      case 'github':
        return <GitHubIcon className="w-4 h-4 text-white" />;
      case 'x':
        return <XIcon className="w-4 h-4 text-gray-300" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-[#e4405f]" />;
      case 'youtube':
        return <YouTubeIcon className="w-4 h-4 text-[#ff0000]" />;
      case 'website':
      default:
        return <Globe className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Edit Networking Card
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Customize your in-person card details, social links, and privacy settings
        </p>
      </div>

      {/* Main Profile Form */}
      <form action={formAction} className="space-y-6">
        {profileState?.error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{profileState.error}</span>
          </div>
        )}

        {profileState?.success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{profileState.message || 'Changes saved successfully.'}</span>
          </div>
        )}

        {/* Section 1: Identity & Bio */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Identity & Presentation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                defaultValue={profile.full_name}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Username (Read Only in Edit) */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Card Handle (Permanent)
              </label>
              <input
                type="text"
                disabled
                value={`/${profile.username}`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-gray-400 font-mono cursor-not-allowed select-none"
              />
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
                name="headline"
                defaultValue={profile.headline || ''}
                placeholder="e.g. Founder & Lead Architect @ Studio North"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Company & Company Visibility */}
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
                  name="company"
                  defaultValue={profile.company || ''}
                  placeholder="e.g. Studio North"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
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
              <input type="hidden" name="showCompany" value={showCompany ? 'true' : 'false'} />
            </div>
          </div>

          {/* Avatar Photo URL */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Avatar Image URL
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {avatarUrl && (
                <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Short Bio (Conferences & Events pitch)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-gray-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                name="bio"
                rows={3}
                defaultValue={profile.bio || ''}
                placeholder="Building next-gen developer tools and high-scale systems. Let's talk AI architectures, distributed systems, and design."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Direct Contact & Privacy Controls */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Channels & Visibility</span>
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">Fine-grained privacy</span>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Phone Number (International format with country code)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profile.phone || ''}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Enables WhatsApp direct chat and phone dialing in the vCard
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Public Phone
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
                <span>{showPhone ? 'Show Publicly' : 'Hidden'}</span>
              </button>
              <input type="hidden" name="showPhone" value={showPhone ? 'true' : 'false'} />
            </div>
          </div>

          {/* Email Address */}
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
                  name="email"
                  defaultValue={profile.email || ''}
                  placeholder="contact@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Public Email
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
                <span>{showEmail ? 'Show Publicly' : 'Hidden'}</span>
              </button>
              <input type="hidden" name="showEmail" value={showEmail ? 'true' : 'false'} />
            </div>
          </div>
        </div>

        {/* Section 3: Visual Theme Selection */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Card Sleeve Theme</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cobalt Blue */}
            <button
              type="button"
              onClick={() => setSelectedTheme('cobalt')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedTheme === 'cobalt'
                  ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-900 mb-2.5" />
              <div className="font-semibold text-xs text-white">Royal Cobalt</div>
              <div className="text-[11px] text-gray-400">Deep vibrant navy</div>
            </button>

            {/* Obsidian Dark */}
            <button
              type="button"
              onClick={() => setSelectedTheme('obsidian')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedTheme === 'obsidian'
                  ? 'bg-slate-900/80 border-slate-400 ring-2 ring-slate-400/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-slate-900 via-zinc-800 to-black mb-2.5" />
              <div className="font-semibold text-xs text-white">Obsidian Mode</div>
              <div className="text-[11px] text-gray-400">Midnight dark finish</div>
            </button>

            {/* Minimal Light */}
            <button
              type="button"
              onClick={() => setSelectedTheme('minimal-light')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedTheme === 'minimal-light'
                  ? 'bg-white/15 border-white ring-2 ring-white/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-gray-100 via-slate-200 to-gray-300 mb-2.5" />
              <div className="font-semibold text-xs text-white">Minimal Light</div>
              <div className="text-[11px] text-gray-400">Clean gallery paper</div>
            </button>
          </div>
          <input type="hidden" name="theme" value={selectedTheme} />
        </div>

        {/* Save Changes CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProfilePending}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isProfilePending ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Section 4: Social & Portfolio Links Manager */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Socials & Portfolio Links</span>
          </h2>
          <span className="text-[11px] text-gray-400 font-mono">
            {links.length} configured
          </span>
        </div>

        {linkMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            {linkMessage}
          </div>
        )}

        {/* Existing Links List */}
        {links.length > 0 ? (
          <div className="space-y-2.5">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="p-2 rounded-xl bg-white/5 shrink-0">
                    {getPlatformIcon(link.platform)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{link.label}</p>
                    <p className="text-xs text-gray-400 truncate font-mono">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label="Test link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={isLinkPending}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                    aria-label="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
            <p className="text-xs text-gray-400">
              No social links added yet. Add your LinkedIn, GitHub, or website below.
            </p>
          </div>
        )}

        {/* Add New Link Form */}
        <form onSubmit={handleAddLink} className="pt-4 border-t border-white/10 space-y-3">
          <span className="block text-xs font-medium text-gray-300">
            Add New Link
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Platform */}
            <select
              value={newPlatform}
              onChange={(e) => {
                const p = e.target.value as SocialPlatform;
                setNewPlatform(p);
                if (!newLabel || ['LinkedIn', 'GitHub', 'X', 'Website', 'Instagram', 'YouTube'].includes(newLabel)) {
                  setNewLabel(p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1));
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="linkedin" className="bg-[#0e121c]">LinkedIn</option>
              <option value="github" className="bg-[#0e121c]">GitHub</option>
              <option value="x" className="bg-[#0e121c]">X (Twitter)</option>
              <option value="website" className="bg-[#0e121c]">Personal Website</option>
              <option value="instagram" className="bg-[#0e121c]">Instagram</option>
              <option value="youtube" className="bg-[#0e121c]">YouTube</option>
              <option value="custom" className="bg-[#0e121c]">Custom Link</option>
            </select>

            {/* Label */}
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Display Label (e.g. LinkedIn)"
              className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            {/* URL */}
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLinkPending || !newLabel || !newUrl}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Link</span>
          </button>
        </form>
      </div>
    </div>
  );
}
