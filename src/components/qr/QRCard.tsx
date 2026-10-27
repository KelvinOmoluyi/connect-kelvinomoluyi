'use client';

import React, { useEffect, useState } from 'react';
import { generateQRCodeSVG, downloadQRCodePNG, downloadQRCodeSVG } from '@/lib/qr';
import { Download, Sparkles, Check, Share2, Copy, ExternalLink } from 'lucide-react';
import { CardTheme } from '@/lib/types';

interface QRCardProps {
  url: string;
  username: string;
  fullName: string;
  headline?: string | null;
  company?: string | null;
  theme?: CardTheme;
  showActions?: boolean;
}

export function QRCard({
  url,
  username,
  fullName,
  headline,
  company,
  theme = 'cobalt',
  showActions = true,
}: QRCardProps) {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!url) return;
    let isMounted = true;
    generateQRCodeSVG(url, {
      width: 260,
      margin: 1,
      color: {
        dark: theme === 'minimal-light' ? '#0f172a' : '#000000',
        light: '#ffffff',
      },
    }).then((svg) => {
      if (isMounted) setSvgHtml(svg);
    });
    return () => {
      isMounted = false;
    };
  }, [url, theme]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} on LinkUp`,
          text: `Connect with ${fullName} via digital networking card`,
          url,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      await downloadQRCodePNG(url, `${username}-qr.png`, 1200);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSVG = async () => {
    await downloadQRCodeSVG(url, `${username}-qr.svg`);
  };

  const sleeveStyles = {
    cobalt: 'bg-gradient-to-b from-[#1844b8] via-[#0d2875] to-[#071644] border-blue-500/30 text-white shadow-[0_20px_50px_rgba(7,22,68,0.7)]',
    obsidian: 'bg-gradient-to-b from-[#1c2132] via-[#0f121d] to-[#08090d] border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]',
    'minimal-light': 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200 text-gray-900 shadow-[0_20px_40px_rgba(0,0,0,0.06)]',
  }[theme];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Physical Card Sleeve Mockup */}
      <div
        className={`relative w-full rounded-3xl p-6 sm:p-7 border backdrop-blur-xl transition-all duration-300 ${sleeveStyles}`}
      >
        {/* Subtle Ambient Specular Highlights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Header inside sleeve */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono opacity-75">
              Live Link
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-50">
            /{username}
          </span>
        </div>

        {/* QR Frame Container */}
        <div className="relative group bg-white rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center transition-transform hover:scale-[1.01] duration-200">
          {svgHtml ? (
            <div
              className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-[200px]"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
              <span className="text-xs text-gray-400">Generating code...</span>
            </div>
          )}

          {/* Under QR Micro-branding */}
          <div className="mt-2 text-center">
            <p className="text-[10px] font-mono font-medium text-gray-400 tracking-wider uppercase">
              Scan to save contact
            </p>
          </div>
        </div>

        {/* Embedded Card Simulation (Tactile peek like reference image 1) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <h4 className="font-semibold text-sm truncate">{fullName}</h4>
            <p className="text-xs opacity-70 truncate">
              {headline || company || 'Digital Card'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-blue-300" />
            <span>vCard 3.0</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="w-full mt-4 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-300" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-300" />
              <span>Share</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-medium transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Export PNG (HD)'}</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-gray-300" />
              <span>Vector SVG</span>
            </button>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] text-gray-400 hover:text-blue-400 transition-colors"
          >
            <span>Open live profile page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
