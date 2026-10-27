export const RESERVED_USERNAMES = new Set([
  'api',
  'login',
  'signup',
  'auth',
  'dashboard',
  'settings',
  'edit',
  'admin',
  'administrator',
  'root',
  'profile',
  'profiles',
  'card',
  'cards',
  'qr',
  'vcard',
  'share',
  'explore',
  'linkup',
  'app',
  'about',
  'contact',
  'privacy',
  'terms',
  'tos',
  'support',
  'help',
  'faq',
  'docs',
  'blog',
  'status',
  'null',
  'undefined',
  'public',
  'static',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

export function isReservedUsername(username: string): boolean {
  if (!username) return true;
  return RESERVED_USERNAMES.has(username.trim().toLowerCase());
}

export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  const clean = username.trim().toLowerCase();
  if (clean.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long.' };
  }
  if (clean.length > 30) {
    return { valid: false, error: 'Username must be at most 30 characters long.' };
  }
  if (!/^[a-z0-9_-]+$/.test(clean)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, underscores, and hyphens.',
    };
  }
  if (isReservedUsername(clean)) {
    return { valid: false, error: 'This username is reserved and cannot be claimed.' };
  }
  return { valid: true };
}
