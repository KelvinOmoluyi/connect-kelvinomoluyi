import React from 'react';

export function MemphisDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top Left angled hatching */}
      <svg
        className="absolute top-6 left-6 sm:top-12 sm:left-16 w-28 h-20 text-[#1e1b4b] opacity-80"
        viewBox="0 0 100 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <line x1="20" y1="10" x2="60" y2="70" />
        <line x1="35" y1="10" x2="75" y2="70" />
        <line x1="50" y1="10" x2="90" y2="70" />
        <line x1="65" y1="10" x2="105" y2="70" />
      </svg>

      {/* Top Right angled hatching */}
      <svg
        className="absolute top-8 right-8 sm:top-14 sm:right-24 w-28 h-16 text-[#1e1b4b] opacity-80"
        viewBox="0 0 100 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <line x1="10" y1="10" x2="90" y2="10" />
        <line x1="15" y1="22" x2="95" y2="22" />
        <line x1="20" y1="34" x2="100" y2="34" />
        <line x1="25" y1="46" x2="105" y2="46" />
      </svg>

      {/* Middle Right hatching */}
      <svg
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-8 w-24 h-16 text-[#1e1b4b] opacity-80"
        viewBox="0 0 80 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <line x1="5" y1="8" x2="75" y2="18" />
        <line x1="10" y1="20" x2="80" y2="30" />
        <line x1="15" y1="32" x2="85" y2="42" />
      </svg>

      {/* Bottom Left diagonal hatching */}
      <svg
        className="absolute bottom-12 left-4 sm:bottom-16 sm:left-14 w-28 h-24 text-[#1e1b4b] opacity-80"
        viewBox="0 0 100 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <line x1="10" y1="60" x2="70" y2="10" />
        <line x1="25" y1="65" x2="85" y2="15" />
        <line x1="40" y1="70" x2="100" y2="20" />
      </svg>

      {/* Bottom Right diagonal hatching */}
      <svg
        className="absolute bottom-8 right-6 sm:bottom-14 sm:right-20 w-32 h-20 text-[#1e1b4b] opacity-80"
        viewBox="0 0 100 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <line x1="10" y1="10" x2="80" y2="60" />
        <line x1="25" y1="10" x2="95" y2="60" />
        <line x1="40" y1="10" x2="110" y2="60" />
      </svg>
    </div>
  );
}
