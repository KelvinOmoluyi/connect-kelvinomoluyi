import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isReservedUsername } from '@/lib/reserved-usernames';
import { PublicProfileView } from '@/components/profile/PublicProfileView';
import { PublicProfileData, ProfileLink } from '@/lib/types';
import { headers } from 'next/headers';

export const instant = false;


interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  if (!username || isReservedUsername(username)) {
    return { title: 'Profile Not Found — LinkUp' };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, headline, bio, avatar_url, is_published')
    .ilike('username', username)
    .single();

  if (!profile || !profile.is_published) {
    return { title: 'Profile Not Found — LinkUp' };
  }

  return {
    title: `${profile.full_name} — LinkUp Digital Networking Card`,
    description: profile.headline || profile.bio || `Connect with ${profile.full_name} on LinkUp`,
    openGraph: {
      title: `${profile.full_name} — Digital Networking Card`,
      description: profile.headline || `Connect with ${profile.full_name}`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const cleanUsername = username?.toLowerCase().trim();

  // Guard against reserved routes
  if (!cleanUsername || isReservedUsername(cleanUsername)) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch published profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      full_name,
      headline,
      bio,
      company,
      phone,
      email,
      avatar_url,
      show_phone,
      show_email,
      show_company,
      is_published,
      theme
    `)
    .ilike('username', cleanUsername)
    .eq('is_published', true)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Fetch active public links
  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Resolve canonical URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  const canonicalUrl = `${appUrl}/${profile.username}`;

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
    links: (links as ProfileLink[]) || [],
  };

  return <PublicProfileView profile={publicData} canonicalUrl={canonicalUrl} />;
}
