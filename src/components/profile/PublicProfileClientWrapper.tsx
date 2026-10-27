'use client';

import React, { useState, useEffect } from 'react';
import { PublicProfileData } from '@/lib/types';
import { getCardByUsername, getLocalEditKey } from '@/lib/firebase/card-service';
import { PublicProfileView } from './PublicProfileView';
import { InstantCardBuilder } from '@/components/creator/InstantCardBuilder';
import { Edit3, ArrowLeft, Loader2, UserX } from 'lucide-react';
import Link from 'next/link';

interface PublicProfileClientWrapperProps {
  username: string;
  initialProfile: PublicProfileData | null;
  canonicalUrl: string;
}

export function PublicProfileClientWrapper({
  username,
  initialProfile,
  canonicalUrl,
}: PublicProfileClientWrapperProps) {
  const [profile, setProfile] = useState<PublicProfileData | null>(initialProfile);
  const [loading, setLoading] = useState(!initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if the current browser created this card
    const storedKey = getLocalEditKey(username);
    if (storedKey) {
      setIsOwner(true);
    }

    // If initialProfile was not available server-side (e.g. stored in browser localStorage)
    if (!profile) {
      getCardByUsername(username).then((data) => {
        setProfile(data);
        setLoading(false);
      });
    }
  }, [username, profile]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#090b10] text-white">
        <div className="ambient-glow w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 bg-blue-600/15" />
        <div className="flex items-center gap-3 text-sm text-gray-400 font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span>Loading networking card...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#090b10] text-white">
        <div className="ambient-glow w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 bg-blue-600/10" />
        <div className="relative max-w-md w-full text-center rounded-3xl p-8 glass-panel border border-white/10 z-10 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
            <UserX className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Card Not Found</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            The handle <code className="text-gray-200 font-mono">/{username}</code> has not been claimed yet or is private.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <span>Claim This Handle on LinkUp</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If owner is in editing mode
  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public View</span>
          </button>
          <InstantCardBuilder initialUsername={username} existingData={profile} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating Owner Edit Bar (Only visible if you created this card on this device) */}
      {isOwner && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xl shadow-blue-600/40 transition-all active:scale-95 border border-blue-400/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Card</span>
          </button>
        </div>
      )}

      <PublicProfileView profile={profile} canonicalUrl={canonicalUrl} />
    </div>
  );
}
