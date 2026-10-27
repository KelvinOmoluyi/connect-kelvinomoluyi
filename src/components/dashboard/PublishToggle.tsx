'use client';

import React, { useState, useTransition } from 'react';
import { togglePublishAction } from '@/app/dashboard/actions';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface PublishToggleProps {
  initialPublished: boolean;
}

export function PublishToggle({ initialPublished }: PublishToggleProps) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !isPublished;
    setIsPublished(nextState);
    startTransition(async () => {
      const res = await togglePublishAction(nextState);
      if (!res.success) {
        // Rollback if failed
        setIsPublished(!nextState);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          isPublished
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
        }`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isPublished ? (
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-rose-400" />
        )}
        <span>{isPublished ? 'Card Live' : 'Card Hidden'}</span>
      </button>
    </div>
  );
}
