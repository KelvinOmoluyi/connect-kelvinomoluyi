import confetti from 'canvas-confetti';

export interface CardData {
  name: string;
  headline: string;
  bio: string;
  phone: string;
  email: string;
  avatarUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  xUrl: string;
  linkedinUrl: string;
}

export const defaultKelvinData: CardData = {
  name: 'Kelvin Omoluyi',
  headline: 'Product-focused software engineer and founder',
  bio: 'Product-focused software engineer and founder building AI-powered products and digital experiences. I enjoy turning ideas into useful products, exploring the intersection of creativity and technologies, and connecting with ambitious people building the future.',
  phone: '+2349046393697',
  email: 'kelvinomoluyi246@gmail.com',
  avatarUrl: '/my-photo.jpeg',
  websiteUrl: 'https://kelvinomoluyi.vercel.app',
  instagramUrl: 'https://www.instagram.com/kelvinomoluyi/',
  xUrl: 'https://x.com/kelvinomoluyi',
  linkedinUrl: 'https://www.linkedin.com/in/kelvin-omoluyi-6aa90031b/',
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
    `URL;TYPE=WORK:${data.websiteUrl}`,
    `NOTE;CHARSET=UTF-8:${data.bio}`,
    `X-SOCIALPROFILE;type=linkedin:${data.linkedinUrl}`,
    `X-SOCIALPROFILE;type=twitter:${data.xUrl}`,
    `X-SOCIALPROFILE;type=instagram:${data.instagramUrl}`,
    'END:VCARD',
  ];

  const blob = new Blob([vcfLines.join('\r\n')], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Kelvin_Omoluyi_contact.vcf`;
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
