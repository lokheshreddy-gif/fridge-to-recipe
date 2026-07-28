import React from 'react';
import { motion } from 'framer-motion';

export default function FridgeWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden select-none">
      
      {/* Central Giant Fridge Vector Watermark */}
      <div className="relative opacity-6 dark:opacity-12 transition-opacity duration-500 transform scale-110 sm:scale-125 md:scale-150">
        <svg
          width="420"
          height="580"
          viewBox="0 0 420 580"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-900 dark:text-indigo-200 stroke-current"
        >
          {/* Main Outer Refrigerator Cabinet Frame */}
          <rect
            x="30"
            y="20"
            width="360"
            height="530"
            rx="36"
            strokeWidth="8"
            className="fill-none"
          />

          {/* Top Freezer Section Divider */}
          <line
            x1="30"
            y1="190"
            x2="390"
            y2="190"
            strokeWidth="6"
            strokeDasharray="4 4"
          />

          {/* Center Vertical Double Door Line */}
          <line
            x1="210"
            y1="20"
            x2="210"
            y2="550"
            strokeWidth="6"
          />

          {/* Left Door Handle */}
          <rect
            x="185"
            y="80"
            width="12"
            height="80"
            rx="6"
            strokeWidth="4"
            className="fill-current"
          />
          <rect
            x="185"
            y="230"
            width="12"
            height="140"
            rx="6"
            strokeWidth="4"
            className="fill-current"
          />

          {/* Right Door Handle */}
          <rect
            x="223"
            y="80"
            width="12"
            height="80"
            rx="6"
            strokeWidth="4"
            className="fill-current"
          />
          <rect
            x="223"
            y="230"
            width="12"
            height="140"
            rx="6"
            strokeWidth="4"
            className="fill-current"
          />

          {/* Interior Shelves Outlines */}
          <line x1="50" y1="270" x2="190" y2="270" strokeWidth="4" opacity="0.6" />
          <line x1="50" y1="360" x2="190" y2="360" strokeWidth="4" opacity="0.6" />
          <line x1="50" y1="450" x2="190" y2="450" strokeWidth="4" opacity="0.6" />

          <line x1="230" y1="270" x2="370" y2="270" strokeWidth="4" opacity="0.6" />
          <line x1="230" y1="360" x2="370" y2="360" strokeWidth="4" opacity="0.6" />
          <line x1="230" y1="450" x2="370" y2="450" strokeWidth="4" opacity="0.6" />

          {/* Ice & Water Dispenser Outline on Right Freezer */}
          <rect
            x="70"
            y="60"
            width="80"
            height="100"
            rx="12"
            strokeWidth="4"
            opacity="0.7"
          />
          <circle cx="110" cy="110" r="16" strokeWidth="4" opacity="0.6" />

          {/* Crisper Drawers */}
          <rect x="50" y="470" x2="190" y2="530" width="140" height="50" rx="10" strokeWidth="4" opacity="0.5" />
          <rect x="230" y="470" x2="370" y2="530" width="140" height="50" rx="10" strokeWidth="4" opacity="0.5" />
        </svg>

        {/* Text Watermark Tag */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase text-slate-900/10 dark:text-indigo-200/10 rotate-[-12deg] select-none">
            FRIDGE
          </span>
        </div>
      </div>

    </div>
  );
}
