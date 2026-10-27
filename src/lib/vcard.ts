import confetti from 'canvas-confetti';

export interface CardData {
  name: string;
  headline: string;
  bio: string;
  phone: string;
  email: string;
  avatarUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  xUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
}

export const defaultKelvinData: CardData = {
  name: 'Kelvin Omoluyi',
  headline: 'Product-focused software engineer and founder',
  bio: 'Product-focused software engineer and founder building AI-powered products and digital experiences. I enjoy turning ideas into useful products, exploring the intersection of creativity and technologies, and connecting with ambitious people building the future.',
  phone: '+1 (555) 234-5678',
  email: 'kelvin@omoluyi.dev',
  avatarUrl: '/kelvin.png',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  tiktokUrl: 'https://tiktok.com',
  xUrl: 'https://x.com',
  pinterestUrl: 'https://pinterest.com',
  linkedinUrl: 'https://linkedin.com',
};

export function downloadKelvinVCard(data: CardData = defaultKelvinData): void {
  const vcfLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${data.name}`,
    `N;CHARSET=UTF-8:Omoluyi;Kelvin;;;`,
    `TITLE;CHARSET=UTF-8:${data.headline}`,
    `TEL;TYPE=CELL,VOICE:${data.phone}`,
    `EMAIL;TYPE=PREF,INTERNET:${data.email}`,
    `NOTE;CHARSET=UTF-8:${data.bio}`,
    `URL;type=linkedin:${data.linkedinUrl}`,
    `URL;type=x:${data.xUrl}`,
    'END:VCARD',
  ];

  const blob = new Blob([vcfLines.join('\r\n')], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name.replace(/\s+/g, '_')}_contact.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff70a6', '#56cbf9', '#ffaa5a', '#00875a', '#000000'],
    });
  } catch {
    // ignore
  }
}
