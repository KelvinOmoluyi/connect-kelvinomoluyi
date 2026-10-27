import { PublicProfileData } from './types';

/**
 * Clean phone number to E.164 digits for WhatsApp wa.me links
 * e.g. "+1 (555) 123-4567" -> "15551234567"
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove non-digit characters
  return phone.replace(/\D/g, '');
}

/**
 * Formats a clean WhatsApp click-to-chat URL with a prefilled message
 */
export function getWhatsAppUrl(phone: string, fullName: string): string {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  if (!cleanPhone) return '';
  const message = `Hi ${fullName}, great connecting with you on LinkUp!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an RFC 2426 compliant vCard 3.0 string based strictly on user-allowed fields
 */
export function generateVCardString(profile: PublicProfileData, canonicalUrl: string): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `REV:${new Date().toISOString()}`,
  ];

  // Full Name & Name breakdown
  const trimmedName = profile.full_name.trim();
  const nameParts = trimmedName.split(' ');
  let firstName = trimmedName;
  let lastName = '';
  if (nameParts.length > 1) {
    firstName = nameParts.slice(0, -1).join(' ');
    lastName = nameParts[nameParts.length - 1];
  }

  lines.push(`FN;CHARSET=UTF-8:${escapeVCardText(profile.full_name)}`);
  lines.push(`N;CHARSET=UTF-8:${escapeVCardText(lastName)};${escapeVCardText(firstName)};;;`);

  // Headline / Title
  if (profile.headline?.trim()) {
    lines.push(`TITLE;CHARSET=UTF-8:${escapeVCardText(profile.headline.trim())}`);
  }

  // Company / Organization (only if allowed by user)
  if (profile.show_company && profile.company?.trim()) {
    lines.push(`ORG;CHARSET=UTF-8:${escapeVCardText(profile.company.trim())}`);
  }

  // Phone (only if allowed by user)
  if (profile.show_phone && profile.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardText(profile.phone.trim())}`);
  }

  // Email (only if allowed by user)
  if (profile.show_email && profile.email?.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${escapeVCardText(profile.email.trim())}`);
  }

  // Canonical Profile URL
  if (canonicalUrl) {
    lines.push(`URL;TYPE=WORK:${canonicalUrl}`);
  }

  // Add social profile links
  if (profile.links && profile.links.length > 0) {
    for (const link of profile.links) {
      if (link.is_active && link.url) {
        if (link.platform === 'linkedin') {
          lines.push(`X-SOCIALPROFILE;type=linkedin:${link.url}`);
        } else if (link.platform === 'x') {
          lines.push(`X-SOCIALPROFILE;type=twitter:${link.url}`);
        } else if (link.platform === 'github') {
          lines.push(`X-SOCIALPROFILE;type=github:${link.url}`);
        } else {
          lines.push(`URL;TYPE=${link.platform.toUpperCase()}:${link.url}`);
        }
      }
    }
  }

  // Bio / Note
  const notes: string[] = [];
  if (profile.bio?.trim()) {
    notes.push(profile.bio.trim());
  }
  notes.push('Exchanged via LinkUp Digital Networking Card');
  lines.push(`NOTE;CHARSET=UTF-8:${escapeVCardText(notes.join(' \\n\\n '))}`);

  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Escapes characters for vCard compliance
 */
function escapeVCardText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\n|\r/g, '\\n');
}

/**
 * Triggers a browser download of the .vcf contact card
 */
export function downloadVCard(profile: PublicProfileData, canonicalUrl: string): void {
  const vcfData = generateVCardString(profile, canonicalUrl);
  const blob = new Blob([vcfData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const filename = `${profile.username || 'contact'}.vcf`;
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
