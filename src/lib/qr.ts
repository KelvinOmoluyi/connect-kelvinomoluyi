import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}

/**
 * Generate an SVG string of the QR code
 */
export async function generateQRCodeSVG(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    width: options?.width || 320,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#ffffff',
    },
    errorCorrectionLevel: 'Q',
  });
}

/**
 * Generate a PNG Data URL of the QR code (supports high-res export up to 1200px)
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options?.width || 400,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || '#000000',
      light: options?.color?.light || '#ffffff',
    },
    errorCorrectionLevel: 'Q',
  });
}

/**
 * Downloads the QR code as a high-resolution PNG file
 */
export async function downloadQRCodePNG(
  text: string,
  filename: string = 'linkup-qr.png',
  dimension: number = 1200
): Promise<void> {
  const dataUrl = await QRCode.toDataURL(text, {
    width: dimension,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * Downloads the QR code as a scalable SVG file
 */
export async function downloadQRCodeSVG(
  text: string,
  filename: string = 'linkup-qr.svg'
): Promise<void> {
  const svgString = await generateQRCodeSVG(text, {
    width: 600,
    margin: 2,
  });

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
