'use client';

import React, { useState } from 'react';
import {
  PhoneIcon,
  MessageIcon,
  EmailIcon,
  InstagramIcon,
  XIcon,
  LinkedInIcon,
  GlobeIcon,
} from './Icons';
import { defaultKelvinData, downloadKelvinVCard } from '@/lib/vcard';
import QRCode from 'qrcode';

export function KelvinCard() {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cleanPhone = '2349046393697';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hi Kelvin, great connecting with you!'
  )}`;

  const handleOpenQR = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : defaultKelvinData.websiteUrl;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
      setShowQR(true);
    } catch {
      // ignore
    }
  };

  const handleSaveContact = () => {
    downloadKelvinVCard();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative w-full max-w-[490px] mx-auto z-10">
      {/* Top subtle utility buttons */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={handleOpenQR}
          className="brutal-btn px-3 py-1.5 rounded-none bg-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <span>Scan QR</span>
          <span>📲</span>
        </button>

        <button
          onClick={handleSaveContact}
          className="brutal-btn px-3.5 py-1.5 rounded-none bg-[#00875a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <span>{savedSuccess ? 'Saved!' : 'Save Contact'}</span>
          <span>💾</span>
        </button>
      </div>

      {/* Main Neo-Brutalist Card */}
      <div className="relative brutal-card w-full p-7 sm:p-9 bg-white">
        {/* Top-Left Green "PAGE" Tag */}
        <div className="absolute top-0 left-0 bg-[#00875a] text-white font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 select-none">
          PAGE
        </div>

        {/* Circular Avatar with double black outline */}
        <div className="mt-2 mb-6">
          <div className="inline-block p-1 rounded-full border-2 border-black bg-white shadow-xs">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-black/30 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/my-photo.jpeg"
                alt="Kelvin Omoluyi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-4">
          Kelvin Omoluyi
        </h1>

        {/* Bio text with bold word highlighting */}
        <div className="text-sm sm:text-[15px] leading-relaxed text-black/90 font-normal mb-8">
          <p>
            <strong className="font-bold text-black">Product-focused</strong> software engineer and founder building AI-powered products and digital experiences. I enjoy turning <strong className="font-bold text-black">ideas</strong> into <strong className="font-bold text-black">useful products</strong>, exploring the intersection of <strong className="font-bold text-black">creativity</strong> and <strong className="font-bold text-black">technologies</strong>, and connecting with ambitious people building the future.
          </p>
        </div>

        {/* Neo-brutalist Action Buttons Row: Call, Message, Email */}
        <div className="mb-10">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Call Button (Pink) */}
            <a
              href="tel:+2349046393697"
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ff7db4] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Call</span>
              <PhoneIcon className="w-3.5 h-3.5" />
            </a>

            {/* Message Button (Sky Blue) - Direct WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#54c4ff] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Message</span>
              <MessageIcon className="w-3.5 h-3.5" />
            </a>

            {/* Email Button (Peach / Orange) */}
            <a
              href="mailto:kelvinomoluyi246@gmail.com?subject=Connecting%20with%20Kelvin"
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ffaa5e] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Email</span>
              <EmailIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Divider line */}
        <div className="-mx-7 sm:-mx-9 border-b-2 border-black mb-6" />

        {/* Social Icons Row (Only Kelvin's provided platforms) */}
        <div className="flex items-center gap-6 sm:gap-7 text-black pt-1">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/kelvinomoluyi/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="hover:opacity-65 transition-opacity"
          >
            <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/kelvinomoluyi"
            target="_blank"
            rel="noopener noreferrer"
            title="X (Twitter)"
            className="hover:opacity-65 transition-opacity"
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/kelvin-omoluyi-6aa90031b/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="hover:opacity-65 transition-opacity"
          >
            <LinkedInIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* Personal Website */}
          <a
            href="https://kelvinomoluyi.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Website / Portfolio"
            className="hover:opacity-65 transition-opacity"
          >
            <GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      {/* QR Code Scan Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="brutal-card p-6 bg-white max-w-xs w-full text-center space-y-4">
            <h3 className="font-extrabold text-base text-black uppercase tracking-wide">
              Scan to Save Contact
            </h3>

            {qrDataUrl && (
              <div className="border-2 border-black p-3 bg-white inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 mx-auto" />
              </div>
            )}

            <p className="text-xs text-black/80 font-medium">
              Point your phone camera to open Kelvin&apos;s digital card & save contact info.
            </p>

            <button
              onClick={() => setShowQR(false)}
              className="brutal-btn w-full py-2 bg-black text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
