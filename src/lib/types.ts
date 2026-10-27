export type CardTheme = 'cobalt' | 'obsidian' | 'minimal-light';

export type SocialPlatform =
  | 'linkedin'
  | 'x'
  | 'github'
  | 'website'
  | 'instagram'
  | 'youtube'
  | 'custom';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  headline?: string | null;
  bio?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  show_phone: boolean;
  show_email: boolean;
  show_company: boolean;
  is_published: boolean;
  theme: CardTheme;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileLink {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileWithLinks extends Profile {
  links: ProfileLink[];
}

export interface PublicProfileData {
  id: string;
  username: string;
  full_name: string;
  headline?: string | null;
  bio?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  show_phone: boolean;
  show_email: boolean;
  show_company: boolean;
  is_published: boolean;
  theme: CardTheme;
  links: ProfileLink[];
}
