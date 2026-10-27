import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('username, is_published')
    .eq('id', user.id)
    .maybeSingle();

  // If user signed up with external provider or profile row was delayed, ensure fallback
  if (!profile) {
    const defaultUsername = `user_${user.id.slice(0, 8)}`;
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: defaultUsername,
        full_name: user.user_metadata?.full_name || 'My Name',
        email: user.email,
        is_published: true,
        show_email: true,
        show_phone: true,
        show_company: true,
        theme: 'cobalt',
      })
      .select('username, is_published')
      .single();

    profile = newProfile;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col relative selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 left-10 bg-blue-600/15" />
      <div className="ambient-glow w-[400px] h-[400px] top-1/2 right-10 bg-indigo-600/10" />

      <DashboardNav
        username={profile?.username || 'user'}
        isPublished={profile?.is_published ?? true}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 z-10">
        {children}
      </main>
    </div>
  );
}
