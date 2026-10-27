import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isReservedUsername } from '@/lib/reserved-usernames';
import { getCardByUsername } from '@/lib/firebase/card-service';
import { PublicProfileClientWrapper } from '@/components/profile/PublicProfileClientWrapper';
import { headers } from 'next/headers';

export const instant = false;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  if (!username || isReservedUsername(username)) {
    return { title: 'Card Not Found — LinkUp' };
  }

  const profile = await getCardByUsername(username);

  if (!profile) {
    return {
      title: `${username} — LinkUp Digital Networking Card`,
      description: `View ${username}'s digital card and scan QR to save contact info.`,
    };
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

  // Guard against reserved system paths
  if (!cleanUsername || isReservedUsername(cleanUsername)) {
    notFound();
  }

  // Resolve canonical URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  const canonicalUrl = `${appUrl}/${cleanUsername}`;

  // Fetch from Firebase (or demo data)
  const profile = await getCardByUsername(cleanUsername);

  return (
    <PublicProfileClientWrapper
      username={cleanUsername}
      initialProfile={profile}
      canonicalUrl={canonicalUrl}
    />
  );
}
