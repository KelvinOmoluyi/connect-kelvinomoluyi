'use client';

import React from 'react';
import Link from 'next/link';
import { ProfileWithLinks } from '@/lib/types';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';

interface CompletionIndicatorProps {
  profile: ProfileWithLinks;
}

export function CompletionIndicator({ profile }: CompletionIndicatorProps) {
  const tasks = [
    { label: 'Full Name', done: Boolean(profile.full_name?.trim()), weight: 15 },
    { label: 'Card Handle', done: Boolean(profile.username?.trim()), weight: 15 },
    { label: 'Professional Headline', done: Boolean(profile.headline?.trim()), weight: 15 },
    { label: 'Company / Project', done: Boolean(profile.company?.trim()), weight: 10 },
    { label: 'Short Bio', done: Boolean(profile.bio?.trim()), weight: 15 },
    { label: 'Direct Phone / WhatsApp', done: Boolean(profile.phone?.trim()), weight: 15 },
    { label: 'Profile Photo', done: Boolean(profile.avatar_url?.trim()), weight: 10 },
    {
      label: 'Social / Portfolio Links',
      done: Boolean(profile.links && profile.links.length > 0),
      weight: 5,
    },
  ];

  const totalScore = tasks.reduce(
    (acc, task) => (task.done ? acc + task.weight : acc),
    0
  );

  const missingTasks = tasks.filter((t) => !t.done);

  return (
    <div className="w-full rounded-3xl p-5 sm:p-6 glass-panel border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-mono text-gray-400">
              Profile Readiness
            </span>
            {totalScore === 100 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>100% Complete</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white">
            {totalScore === 100
              ? 'Your networking card is event-ready!'
              : `${totalScore}% Event Ready`}
          </h3>
        </div>

        {/* Action button to edit */}
        {missingTasks.length > 0 && (
          <Link
            href="/dashboard/edit"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-medium transition-all"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-700 ease-out"
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Missing items suggestions */}
      {missingTasks.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] text-gray-400 self-center">Boost card:</span>
          {missingTasks.slice(0, 3).map((task) => (
            <Link
              key={task.label}
              href="/dashboard/edit"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white border border-white/5 transition-colors"
            >
              <Circle className="w-2.5 h-2.5 text-blue-400" />
              <span>+{task.weight}% {task.label}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>All contact channels configured for maximum networking impact.</span>
        </div>
      )}
    </div>
  );
}
