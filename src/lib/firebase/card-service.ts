import { db, isFirebaseConfigured } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { PublicProfileData, CardTheme, SocialPlatform, ProfileLink } from '../types';

export interface CardRecord extends PublicProfileData {
  editKey: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_PREFIX = 'linkup_card_';
const LOCAL_STORAGE_KEY_PREFIX = 'linkup_edit_key_';

/**
 * Generate a random URL-safe edit token
 */
export function generateEditKey(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Store the edit token in local browser storage so the owner can edit without an account
 */
export function storeLocalEditKey(username: string, editKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`, editKey);
  } catch {
    // ignore
  }
}

/**
 * Get stored edit token from browser
 */
export function getLocalEditKey(username: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`);
  } catch {
    return null;
  }
}

/**
 * Check if a handle/username is already taken in Firestore (or local cache)
 */
export async function isHandleTaken(username: string): Promise<boolean> {
  const clean = username.trim().toLowerCase();

  // Check Firestore if configured
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'cards', clean);
      const snapshot = await getDoc(docRef);
      return snapshot.exists();
    } catch (err) {
      console.warn('Firestore handle check warning:', err);
    }
  }

  // Fallback to local storage check
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${clean}`);
      return Boolean(cached);
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Save a new card or update an existing one without any login
 */
export async function saveCard(
  card: Omit<CardRecord, 'createdAt' | 'updatedAt' | 'editKey'> & { editKey?: string }
): Promise<{ success: boolean; editKey: string; error?: string }> {
  const cleanUsername = card.username.trim().toLowerCase();
  const now = new Date().toISOString();

  // Retain existing editKey or generate new one
  let editKey = card.editKey || getLocalEditKey(cleanUsername);
  if (!editKey) {
    editKey = generateEditKey();
  }

  const record: CardRecord = {
    ...card,
    id: cleanUsername,
    username: cleanUsername,
    editKey,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Save to local browser storage first for instant feedback & offline capability
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${cleanUsername}`, JSON.stringify(record));
      storeLocalEditKey(cleanUsername, editKey);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // 2. Persist to Firestore if configured
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'cards', cleanUsername);
      await setDoc(docRef, record, { merge: true });
    } catch (err: unknown) {
      console.error('Firestore save failed:', err);
      // Even if Firestore network fails, local storage succeeded
    }
  }

  return { success: true, editKey };
}

/**
 * Fetch a card by username from Firestore (with local cache fallback)
 */
export async function getCardByUsername(username: string): Promise<PublicProfileData | null> {
  const clean = username.trim().toLowerCase();

  // Try Firestore first
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'cards', clean);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as CardRecord;
        return {
          id: data.id || clean,
          username: data.username || clean,
          full_name: data.full_name || '',
          headline: data.headline || null,
          bio: data.bio || null,
          company: data.show_company ? data.company || null : null,
          phone: data.show_phone ? data.phone || null : null,
          email: data.show_email ? data.email || null : null,
          avatar_url: data.avatar_url || null,
          show_phone: data.show_phone ?? true,
          show_email: data.show_email ?? true,
          show_company: data.show_company ?? true,
          is_published: data.is_published ?? true,
          theme: data.theme || 'cobalt',
          links: data.links || [],
        };
      }
    } catch (err) {
      console.warn('Firestore getCard warning:', err);
    }
  }

  // Fallback to local storage (for offline or local dev testing)
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${clean}`);
      if (cached) {
        const parsed = JSON.parse(cached) as CardRecord;
        return {
          id: parsed.id || clean,
          username: parsed.username || clean,
          full_name: parsed.full_name || '',
          headline: parsed.headline || null,
          bio: parsed.bio || null,
          company: parsed.show_company ? parsed.company || null : null,
          phone: parsed.show_phone ? parsed.phone || null : null,
          email: parsed.show_email ? parsed.email || null : null,
          avatar_url: parsed.avatar_url || null,
          show_phone: parsed.show_phone ?? true,
          show_email: parsed.show_email ?? true,
          show_company: parsed.show_company ?? true,
          is_published: parsed.is_published ?? true,
          theme: parsed.theme || 'cobalt',
          links: parsed.links || [],
        };
      }
    } catch {
      // ignore
    }
  }

  // Demo profile fallback for showcase
  if (clean === 'alexrivera' || clean === 'demo') {
    return {
      id: 'demo',
      username: 'alexrivera',
      full_name: 'Alex Rivera',
      headline: 'Founder & Principal Architect',
      company: 'Studio North',
      bio: 'Designing next-generation developer tooling, distributed cloud architectures, and tactile user interfaces.',
      phone: '+1 (555) 382-9104',
      email: 'alex@studionorth.dev',
      avatar_url: null,
      show_phone: true,
      show_email: true,
      show_company: true,
      is_published: true,
      theme: 'cobalt',
      links: [
        {
          id: '1',
          profile_id: 'demo',
          platform: 'linkedin',
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/alexrivera',
          is_active: true,
          sort_order: 0,
        },
        {
          id: '2',
          profile_id: 'demo',
          platform: 'github',
          label: 'GitHub',
          url: 'https://github.com/alexrivera',
          is_active: true,
          sort_order: 1,
        },
        {
          id: '3',
          profile_id: 'demo',
          platform: 'website',
          label: 'Portfolio & Works',
          url: 'https://studionorth.dev',
          is_active: true,
          sort_order: 2,
        },
      ],
    };
  }

  return null;
}
