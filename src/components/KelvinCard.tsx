'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  PhoneIcon,
  MessageIcon,
  EmailIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  XIcon,
  PinterestIcon,
  LinkedInIcon,
} from './Icons';
import { CardData, defaultKelvinData, downloadKelvinVCard } from '@/lib/vcard';
import QRCode from 'qrcode';

export function KelvinCard() {
  const [data, setData] = useState<CardData>(defaultKelvinData);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpenQR = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://kelvin.linkup.to';
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
    downloadKelvinVCard(data);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative w-full max-w-[490px] mx-auto z-10">
      {/* Top action pill toolbar (floating above card) */}
      <div className="flex items-center justify-between mb-3 px-2">
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

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="brutal-btn px-3 py-1.5 rounded-none bg-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isEditing ? 'View Card' : 'Edit Info'}</span>
          <span>✏️</span>
        </button>
      </div>

      {/* Main Neo-Brutalist Card */}
      <div className="relative brutal-card w-full p-7 sm:p-9">
        {/* Top-Left Green "PAGE" Tag */}
        <div className="absolute top-0 left-0 bg-[#00875a] text-white font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5">
          PAGE
        </div>

        {/* Circular Avatar with double black outline */}
        <div className="mt-2 mb-6">
          <div className="inline-block p-1 rounded-full border-2 border-black bg-white">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-4">
          {data.name}
        </h1>

        {/* Bio text with precise bold word highlighting from the mockup */}
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
              href={`tel:${data.phone.replace(/\D/g, '')}`}
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ff7db4] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Call</span>
              <PhoneIcon className="w-3.5 h-3.5" />
            </a>

            {/* Message Button (Sky Blue) */}
            <a
              href={`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${data.name}, great connecting with you!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#54c4ff] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Message</span>
              <MessageIcon className="w-3.5 h-3.5" />
            </a>

            {/* Email Button (Peach / Orange) */}
            <a
              href={`mailto:${data.email}?subject=${encodeURIComponent(`Connecting with ${data.name}`)}`}
              className="brutal-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#ffaa5e] text-black font-semibold text-xs sm:text-sm rounded-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Email</span>
              <EmailIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Divider line */}
        <div className="-mx-7 sm:-mx-9 border-b-2 border-black mb-6" />

        {/* Social Icons Row */}
        <div className="flex items-center gap-5 sm:gap-6 text-black pt-1">
          {/* Instagram */}
          <a
            href={data.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="hover:opacity-70 transition-opacity"
          >
            <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* Facebook */}
          <a
            href={data.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="hover:opacity-70 transition-opacity"
          >
            <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* TikTok */}
          <a
            href={data.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            className="hover:opacity-70 transition-opacity"
          >
            <TikTokIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* X (Twitter) */}
          <a
            href={data.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="X (Twitter)"
            className="hover:opacity-70 transition-opacity"
          >
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* Pinterest */}
          <a
            href={data.pinterestUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Pinterest"
            className="hover:opacity-70 transition-opacity"
          >
            <PinterestIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>

          {/* LinkedIn */}
          <a
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="hover:opacity-70 transition-opacity"
          >
            <LinkedInIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      {/* Optional In-Place Editor Drawer */}
      {isEditing && (
        <div className="mt-4 brutal-card p-6 bg-white animate-in fade-in duration-200">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-black pb-2">
            Customize Profile Info
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full p-2 border-2 border-black rounded-none font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Phone Number</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full p-2 border-2 border-black rounded-none font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full p-2 border-2 border-black rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="brutal-btn px-4 py-2 bg-[#00875a] text-white font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
              Point your phone camera to open {data.name}&apos;s profile & save contact.
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
