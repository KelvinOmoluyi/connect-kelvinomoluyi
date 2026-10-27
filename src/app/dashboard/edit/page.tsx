import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { ProfileWithLinks, ProfileLink } from '@/lib/types';

export const instant = false;


export default async function DashboardEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/dashboard');
  }

  // Fetch current user's links
  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', user.id)
    .order('sort_order', { ascending: true });

  const profileWithLinks: ProfileWithLinks = {
    ...profile,
    links: (links as ProfileLink[]) || [],
  };

  return <ProfileEditor profile={profileWithLinks} />;
}
