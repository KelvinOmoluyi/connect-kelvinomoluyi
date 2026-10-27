# LinkUp — Instant QR-Based Digital Networking Card

LinkUp is a sleek, mobile-first web application designed for high-impact in-person networking. It lets anyone enter their professional details, preview their digital card live, and immediately generate an event-ready scannable QR card—**with zero account signup or login required**.

Attendees scan your code to open your card and download a valid RFC-compliant `.vcf` contact file straight into their iPhone or Android address book in one tap.

---

## What Makes This Experience Fast & Frictionless

- **Zero Auth Barrier**: No passwords, no confirmation emails, no login walls. Anyone can enter their details and walk away with their live card and scannable QR code in under 30 seconds.
- **Firebase Firestore & Local Storage**: Cards are saved directly to Firestore (`/cards/{username}`). An automatic tamper-proof `editKey` is saved in the creator's browser, allowing them to edit their card at any time from their device without needing a password.
- **Physical QR Sleeve Aesthetics**: Modeled after clean cobalt blue tactile card sleeves and ambient dark glows with micro-interactions.
- **One-Tap Contact Save (`.vcf` 3.0)**: Exports UTF-8 vCard with your full name, headline, company, phone number, email, and social profiles.
- **Granular Privacy Controls**: Individually choose whether direct phone, email, and company are public or hidden.
- **Direct WhatsApp Action**: Pre-formatted WhatsApp link with international E.164 digits and a prefilled greeting message.
- **High-Res HD PNG & Scalable SVG Export**: Export clean 1200×1200px PNG or vector SVG for phone wallpaper, lanyard badges, or physical print sleeves.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Database & Storage**: Firebase Firestore (No Auth Required)
- **QR Generation**: `qrcode` with high error correction (`Q` & `H` level)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) (free Spark plan includes 1GB storage, 50,000 reads/day, 20,000 writes/day with no credit card required).

1. In Firebase Console, create a **Firestore Database** (start in production or test mode).
2. Go to **Project Settings > General > Your apps** and add a Web App.
3. Copy the Firebase config keys into `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Deploy Firestore Security Rules

Paste the contents of `firestore.rules` into your **Firebase Console > Firestore Database > Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{username} {
      // 1. Anyone can view public cards (no account required)
      allow read: if true;

      // 2. Anyone can claim an unused handle/card without signing up
      allow create: if !exists(/databases/$(database)/documents/cards/$(username))
                    && request.resource.data.username == username;

      // 3. Only the creator with matching editKey can update their card
      allow update: if request.resource.data.editKey == resource.data.editKey;

      // 4. Deletions require matching editKey
      allow delete: if request.resource.data.editKey == resource.data.editKey;
    }
  }
}
```

---

## Routes

- `/` — Instant Card Builder with real-time interactive preview, QR sleeve generation, and HD download.
- `/[username]` — Public networking card optimized for mobile screens. One-tap vCard save, WhatsApp chat, email, and social pills.
- (Legacy `/login` and `/signup` automatically redirect to the builder at `/`).

---

## Running Locally

```bash
npm run dev
# or production mode
npm run build
npm run start
```
