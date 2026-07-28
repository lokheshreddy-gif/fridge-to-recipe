import React from 'react';
import { motion } from 'framer-motion';

export default function OpeningFridgeScene() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-65 dark:opacity-40 transition-opacity duration-500">
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Soft Cold Interior Fridge Light Glow (Pulses bright across full page when doors open) */}
        <motion.div
          animate={{
            opacity: [0.35, 0.95, 0.95, 0.35, 0.35],
            scale: [0.9, 1.15, 1.15, 0.9, 0.9]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-4 bg-gradient-to-tr from-sky-400/60 via-indigo-400/40 to-teal-300/50 rounded-3xl blur-3xl"
        />

        {/* Outer Fridge Main Cabinet Frame (Spans Full Page) */}
        <div className="relative w-full h-full bg-white dark:bg-slate-900/90 border-4 border-slate-300 dark:border-slate-700/80 rounded-none p-4 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Top Freezer Shelf Interior */}
          <div className="w-full h-40 sm:h-52 bg-sky-50/90 dark:bg-slate-800/80 border-b-4 border-slate-300 dark:border-slate-700/80 rounded-t-2xl flex items-center justify-around px-6 relative overflow-hidden shrink-0">
            {/* Interior Freezer Frost & Light */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300/40 to-transparent pointer-events-none" />
            <div className="w-28 sm:w-40 h-14 sm:h-20 bg-sky-400/40 dark:bg-sky-400/30 rounded-xl border-2 border-sky-400/60 dark:border-sky-300/50 shadow-md" />
            <div className="w-24 sm:w-36 h-16 sm:h-24 bg-amber-400/40 dark:bg-amber-400/30 rounded-xl border-2 border-amber-400/50 dark:border-amber-300/40 shadow-md" />
            <div className="w-24 sm:w-36 h-16 sm:h-24 bg-emerald-400/40 dark:bg-emerald-400/30 rounded-xl border-2 border-emerald-400/50 dark:border-emerald-300/40 shadow-md hidden sm:block" />
          </div>

          {/* Main Fridge Shelves Interior (Spans Full Middle Page) */}
          <div className="flex-1 py-6 flex flex-col justify-around relative bg-slate-50/90 dark:bg-transparent">
            {/* Shelf 1 */}
            <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full relative">
              <div className="absolute bottom-1.5 left-10 sm:left-24 w-16 sm:w-24 h-16 sm:h-24 bg-emerald-500/40 dark:bg-emerald-400/30 rounded-full border-2 border-emerald-400/60 dark:border-emerald-300/50 shadow-md" />
              <div className="absolute bottom-1.5 right-12 sm:right-32 w-14 sm:w-20 h-20 sm:h-28 bg-indigo-500/40 dark:bg-indigo-400/30 rounded-xl border-2 border-indigo-400/60 dark:border-indigo-300/50 shadow-md" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-16 sm:h-20 bg-rose-500/40 dark:bg-rose-400/30 rounded-full border-2 border-rose-400/60 dark:border-rose-300/50 shadow-md" />
            </div>

            {/* Shelf 2 */}
            <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full relative">
              <div className="absolute bottom-1.5 left-20 sm:left-40 w-20 sm:w-28 h-14 sm:h-20 bg-amber-500/40 dark:bg-amber-500/30 rounded-xl border-2 border-amber-400/60 dark:border-amber-400/50 shadow-md" />
              <div className="absolute bottom-1.5 right-24 sm:right-48 w-12 sm:w-16 h-12 sm:h-16 bg-rose-500/40 dark:bg-rose-400/30 rounded-full border-2 border-rose-400/60 dark:border-rose-300/50 shadow-md" />
            </div>

            {/* Crisper Drawers */}
            <div className="w-full h-24 sm:h-32 bg-emerald-50/90 dark:bg-slate-800/90 border-2 border-emerald-200 dark:border-slate-700/80 rounded-b-2xl flex items-center justify-around px-4">
              <div className="w-44 sm:w-64 h-16 sm:h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl border-2 border-emerald-300 dark:border-emerald-400/30 flex items-center justify-center shadow-xs">
                <span className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Fresh Produce</span>
              </div>
              <div className="w-44 sm:w-64 h-16 sm:h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl border-2 border-emerald-300 dark:border-emerald-400/30 flex items-center justify-center shadow-xs">
                <span className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Chill Zone</span>
              </div>
            </div>
          </div>

          {/* ANIMATED FULL-PAGE LEFT FRIDGE DOOR (SWINGS OPEN & CLOSED CONTINUOUSLY) */}
          <motion.div
            animate={{
              rotateY: [0, -115, -115, 0, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.35, 0.65, 0.95, 1]
            }}
            style={{ transformOrigin: 'left center' }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-slate-100 dark:bg-slate-800/95 border-r-4 border-slate-300 dark:border-slate-600 flex items-center justify-end pr-6 shadow-2xl z-20"
          >
            {/* Left Full-Length Door Handle */}
            <div className="w-4 sm:w-5 h-64 sm:h-96 bg-gradient-to-b from-indigo-500 via-indigo-300 to-indigo-500 dark:from-slate-500 dark:via-slate-100 dark:to-slate-500 rounded-full shadow-2xl border-2 border-indigo-400 dark:border-slate-400" />
            
            {/* Door Interior Racks */}
            <div className="absolute left-4 top-16 bottom-16 w-20 sm:w-28 border-l-2 border-slate-300 dark:border-slate-700 opacity-60 flex flex-col justify-around">
              <div className="w-16 sm:w-24 h-10 sm:h-14 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
              <div className="w-16 sm:w-24 h-12 sm:h-16 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
              <div className="w-16 sm:w-24 h-14 sm:h-20 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
          </motion.div>

          {/* ANIMATED FULL-PAGE RIGHT FRIDGE DOOR (SWINGS OPEN & CLOSED CONTINUOUSLY) */}
          <motion.div
            animate={{
              rotateY: [0, 115, 115, 0, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.35, 0.65, 0.95, 1]
            }}
            style={{ transformOrigin: 'right center' }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-slate-100 dark:bg-slate-800/95 border-l-4 border-slate-300 dark:border-slate-600 flex items-center justify-start pl-6 shadow-2xl z-20"
          >
            {/* Right Full-Length Door Handle */}
            <div className="w-4 sm:w-5 h-64 sm:h-96 bg-gradient-to-b from-indigo-500 via-indigo-300 to-indigo-500 dark:from-slate-500 dark:via-slate-100 dark:to-slate-500 rounded-full shadow-2xl border-2 border-indigo-400 dark:border-slate-400" />

            {/* Door Interior Racks */}
            <div className="absolute right-4 top-16 bottom-16 w-20 sm:w-28 border-r-2 border-slate-300 dark:border-slate-700 opacity-60 flex flex-col justify-around">
              <div className="w-16 sm:w-24 h-10 sm:h-14 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
              <div className="w-16 sm:w-24 h-12 sm:h-16 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
              <div className="w-16 sm:w-24 h-14 sm:h-20 border-2 border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
