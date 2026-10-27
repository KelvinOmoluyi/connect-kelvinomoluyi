# LinkUp — QR-Based Digital Networking Card

LinkUp is a sleek, mobile-first web application designed for high-impact in-person networking at conferences, meetups, and professional events. It allows professionals to build a digital networking profile, generate an event-ready scannable QR card, and enable new connections to download an RFC-compliant `.vcf` contact card directly into their phone's address book with one tap—no app installation required.

---

## Key Features

- **Event-Ready Scannable QR Sleeve**: High-contrast, scannable QR code generated from your canonical URL (`https://yourdomain.com/[username]`). Private personal contact information is never embedded in the QR pattern, allowing you to update contact details anytime without reprinting.
- **One-Tap Contact Download (`.vcf` 3.0)**: Visitors tap "Save Contact" to download a clean vCard directly into Apple Contacts, Google Contacts, or Samsung Contacts with your photo, name, headline, company, phone, email, and social links.
- **Granular Privacy Toggles**: Independently control whether your direct phone number, email address, and company are public or hidden.
- **Direct WhatsApp & Email Actions**: Pre-formatted WhatsApp link with country code and a polite greeting message (*"Hi [Name], great connecting with you on LinkUp!"*).
- **Profile Completion Tracker**: Dynamic readiness score with actionable prompts to maximize your networking impact.
- **Vector & HD Export**: Export your QR code as a 1200×1200px PNG or scalable SVG for phone lock screens, pitch decks, and physical badges.
- **Reserved Username Guards**: Protects all application routes (`/dashboard`, `/login`, `/signup`, `/api`, etc.) from being claimed as usernames.
- **Row Level Security (RLS)**: PostgreSQL policies guarantee users can only read and mutate their own data, while public visitors can only read published profiles and explicitly public fields.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components & Server Actions, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Auth & Database**: Supabase (PostgreSQL + Supabase Auth with `@supabase/ssr`)
- **QR Code Engine**: `qrcode` with high error-correction (`Q` & `H` level)
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd relink
npm install
```

### 2. Configure Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- In production on Vercel, set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://linkup.vercel.app`).

### 3. Apply Database Migrations in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** > **New Query**.
3. Copy and run the SQL migration script located at:
   ```
   supabase/migrations/20261027000000_create_networking_cards_schema.sql
   ```
   This script creates:
   - `public.profiles` table with unique username constraints, visibility flags, and cascade deletion.
   - `public.profile_links` table for social and portfolio links.
   - Indexes on usernames and profile IDs for fast lookups.
   - Row Level Security (RLS) policies allowing public read of published profiles and authenticated write of own records.
   - `public.public_profiles` secure view.
   - Automatic `updated_at` triggers.

4. In **Supabase Authentication > Providers > Email**:
   - Enable Email Signup.
   - (Optional) Toggle "Confirm email" according to your preference. If disabled, users can immediately log in upon registration.

---

## Application Routes

- `/` — Sleek landing page featuring physical card & sleeve showcase, value proposition, and instant username claim form.
- `/signup` — Registration with real-time unique handle check and reserved routes guard.
- `/login` — Secure authentication with redirect parameter handling.
- `/dashboard` — Card overview, profile readiness tracker, QR sleeve preview, high-res PNG/SVG export, and publish/unpublish toggle.
- `/dashboard/edit` — Full profile editor with avatar preview, direct phone/email visibility toggles, card theme selector, and social links manager.
- `/[username]` — Public networking card optimized for mobile screens. One-tap vCard save, WhatsApp chat, email, and social pills.
- `/auth/callback` — Exchange route for email confirmation and password reset callbacks.

---

## Vercel Deployment

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com/new).
3. In **Settings > Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://linkup.yourdomain.com`)
4. Click **Deploy**. Vercel will build and optimize your static and dynamic routes.

---

## Verification & Mobile Testing

- **In-Person QR Scanning**: Point an iPhone Camera or Android Google Lens at the QR card on `/dashboard` or `/[username]` to test live navigation to the public profile.
- **Contact Download**: Tap "Save Contact" on any mobile browser. It downloads `[username].vcf` which prompts the OS to open your default Contacts app.
- **WhatsApp Direct**: Tap "WhatsApp" on mobile. It opens WhatsApp directly with a prefilled greeting message addressed to the user.
