'use client';

import React, { useActionState, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { signUpAction, AuthState } from '../auth/actions';
import { Sparkles, ArrowRight, Lock, Mail, User, AtSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isReservedUsername } from '@/lib/reserved-usernames';

interface SignUpPageProps {
  searchParams: Promise<{ username?: string }>;
}

function SignUpForm({ searchParamsPromise }: { searchParamsPromise: Promise<{ username?: string }> }) {
  const searchParams = use(searchParamsPromise);
  const initialUsername = (searchParams?.username || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    signUpAction,
    null
  );

  const [username, setUsername] = useState(initialUsername);
  const [usernameWarning, setUsernameWarning] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(val);

    if (val.length > 0 && val.length < 3) {
      setUsernameWarning('Username must be at least 3 characters.');
    } else if (isReservedUsername(val)) {
      setUsernameWarning('This username is reserved.');
    } else {
      setUsernameWarning(null);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 glass-panel border border-white/10 z-10 shadow-2xl backdrop-blur-2xl">
      {state?.error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="leading-snug">{state.error}</div>
        </div>
      )}

      {state?.success && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div className="leading-snug">Registration initiated. Redirecting to your dashboard...</div>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Maya Chen"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-gray-300">
              Card Handle (Unique Username)
            </label>
            {username && (
              <span className="text-[10px] font-mono text-gray-400">
                linkup.to/{username}
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <AtSign className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={handleUsernameChange}
              placeholder="mayachen"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>
          {usernameWarning && (
            <p className="mt-1 text-[11px] text-amber-400 font-mono">
              {usernameWarning}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="maya@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Minimum 6 characters
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isPending || Boolean(usernameWarning)}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your card...</span>
            </span>
          ) : (
            <>
              <span>Create Digital Card</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          Already have a LinkUp card?{' '}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage(props: SignUpPageProps) {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 left-1/2 -translate-x-1/2 bg-blue-600/15" />
      <div className="ambient-glow w-[400px] h-[400px] bottom-0 right-10 bg-indigo-600/10" />

      {/* Brand Header */}
      <div className="text-center mb-8 z-10">
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl text-white">
            Link<span className="text-blue-500">Up</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Create your digital networking card
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Set up your profile and scannable QR sleeve in under 60 seconds
        </p>
      </div>

      <Suspense fallback={<div className="w-full max-w-md h-96 rounded-3xl bg-white/5 animate-pulse" />}>
        <SignUpForm searchParamsPromise={props.searchParams} />
      </Suspense>
    </div>
  );
}
