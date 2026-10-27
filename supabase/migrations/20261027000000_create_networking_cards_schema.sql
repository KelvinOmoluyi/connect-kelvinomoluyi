-- Supabase Migration: LinkUp Digital Networking Card App
-- Schema for profiles, links, visibility flags, and Row Level Security (RLS)

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  headline text,
  bio text,
  company text,
  phone text,
  email text,
  avatar_url text,

  -- Visibility flags: allow users fine-grained control over what public visitors see
  show_phone boolean default true not null,
  show_email boolean default true not null,
  show_company boolean default true not null,
  is_published boolean default true not null,

  -- Personalization
  theme text default 'cobalt' not null check (theme in ('cobalt', 'obsidian', 'minimal-light')),

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Ensure username meets minimum length and valid URL character standards
  constraint username_format check (username ~* '^[a-zA-Z0-9_-]{3,30}$')
);

-- 2. Create profile_links table (socials, portfolios, custom links)
create table if not exists public.profile_links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('linkedin', 'x', 'github', 'website', 'instagram', 'youtube', 'custom')),
  label text not null,
  url text not null,
  is_active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Indexes for fast resolution at scale
create index if not exists idx_profiles_username on public.profiles (lower(username));
create index if not exists idx_profiles_is_published on public.profiles (is_published);
create index if not exists idx_profile_links_profile_id on public.profile_links (profile_id);
create index if not exists idx_profile_links_order on public.profile_links (profile_id, sort_order asc);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.profile_links enable row level security;

-- 5. RLS Policies for Profiles
-- A. Unauthenticated / Public SELECT: Can view profiles only if published
create policy "Allow public view for published profiles"
  on public.profiles
  for select
  using (is_published = true or (auth.uid() = id));

-- B. Authenticated users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- C. Authenticated users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- D. Authenticated users can delete their own profile
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

-- 6. RLS Policies for Profile Links
-- A. Public SELECT: Can view links of published profiles where is_active is true, or if owner
create policy "Allow public view for active links of published profiles"
  on public.profile_links
  for select
  using (
    (is_active = true and exists (
      select 1 from public.profiles
      where profiles.id = profile_links.profile_id
      and profiles.is_published = true
    ))
    or (auth.uid() = profile_id)
  );

-- B. Owner INSERT
create policy "Users can insert own profile links"
  on public.profile_links
  for insert
  with check (auth.uid() = profile_id);

-- C. Owner UPDATE
create policy "Users can update own profile links"
  on public.profile_links
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- D. Owner DELETE
create policy "Users can delete own profile links"
  on public.profile_links
  for delete
  using (auth.uid() = profile_id);

-- 7. Secure View for Public Queries (Prevents leaking private emails/phones if user unchecked visibility)
create or replace view public.public_profiles as
select
  id,
  username,
  full_name,
  headline,
  bio,
  case when show_company then company else null end as company,
  case when show_phone then phone else null end as phone,
  case when show_email then email else null end as email,
  avatar_url,
  theme,
  show_phone,
  show_email,
  show_company,
  is_published,
  created_at
from public.profiles
where is_published = true;

-- Grant select on view
grant select on public.public_profiles to anon, authenticated;

-- 8. Updated_at automated trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_profile_links_updated_at
  before update on public.profile_links
  for each row execute function public.handle_updated_at();
