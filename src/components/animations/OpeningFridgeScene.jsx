import React from 'react';
import { motion } from 'framer-motion';

export default function OpeningFridgeScene() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30 dark:opacity-40">
      <div className="relative w-full max-w-4xl h-[520px] flex items-center justify-center">
        
        {/* Soft Cold Interior Fridge Light Glow (Pulses bright when doors open) */}
        <motion.div
          animate={{
            opacity: [0.2, 0.9, 0.9, 0.2, 0.2],
            scale: [0.9, 1.1, 1.1, 0.9, 0.9]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute w-[440px] h-[480px] bg-gradient-to-tr from-sky-400/40 via-indigo-500/30 to-teal-300/30 rounded-3xl blur-3xl"
        />

        {/* Outer Fridge Main Cabinet Frame */}
        <div className="relative w-[340px] sm:w-[420px] h-[480px] bg-slate-900/90 border-4 border-slate-700/80 rounded-3xl p-4 shadow-2xl flex flex-col justify-between overflow-visible">
          
          {/* Top Freezer Shelf Interior */}
          <div className="w-full h-32 bg-slate-800/80 border-b-2 border-slate-700/80 rounded-t-2xl flex items-center justify-around px-4 relative overflow-hidden">
            {/* Interior Freezer Frost & Light */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-transparent pointer-events-none" />
            <div className="w-20 h-10 bg-sky-400/30 rounded-lg border border-sky-300/50 shadow-md" />
            <div className="w-16 h-12 bg-amber-400/30 rounded-lg border border-amber-300/40 shadow-md" />
          </div>

          {/* Main Fridge Shelves Interior */}
          <div className="flex-1 py-4 flex flex-col justify-around relative">
            {/* Shelf 1 */}
            <div className="w-full h-1.5 bg-slate-700 rounded-full relative">
              <div className="absolute bottom-1 left-6 w-12 h-12 bg-emerald-400/30 rounded-full border border-emerald-300/50 shadow-sm" />
              <div className="absolute bottom-1 right-10 w-10 h-14 bg-indigo-400/30 rounded-md border border-indigo-300/50 shadow-sm" />
            </div>

            {/* Shelf 2 */}
            <div className="w-full h-1.5 bg-slate-700 rounded-full relative">
              <div className="absolute bottom-1 left-16 w-14 h-10 bg-amber-500/30 rounded-lg border border-amber-400/50 shadow-sm" />
              <div className="absolute bottom-1 right-20 w-8 h-8 bg-rose-400/30 rounded-full border border-rose-300/50 shadow-sm" />
            </div>

            {/* Crisper Drawers */}
            <div className="w-full h-20 bg-slate-800/90 border border-slate-700/80 rounded-b-xl flex items-center justify-around px-2">
              <div className="w-36 h-12 bg-emerald-500/20 rounded-lg border border-emerald-400/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Fresh Produce</span>
              </div>
              <div className="w-36 h-12 bg-emerald-500/20 rounded-lg border border-emerald-400/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Chill Zone</span>
              </div>
            </div>
          </div>

          {/* ANIMATED LEFT FRIDGE DOOR (SWINGS OPEN & CLOSED CONTINUOUSLY) */}
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
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-slate-800/95 border-r-2 border-slate-600 rounded-l-3xl flex items-center justify-end pr-3 shadow-2xl z-20"
          >
            {/* Left Door Handle */}
            <div className="w-3 h-36 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-lg border border-slate-300" />
            
            {/* Door Interior Racks */}
            <div className="absolute left-2 top-10 bottom-10 w-12 border-l border-slate-700 opacity-40 flex flex-col justify-around">
              <div className="w-10 h-6 border border-slate-600 rounded-sm" />
              <div className="w-10 h-8 border border-slate-600 rounded-sm" />
              <div className="w-10 h-10 border border-slate-600 rounded-sm" />
            </div>
          </motion.div>

          {/* ANIMATED RIGHT FRIDGE DOOR (SWINGS OPEN & CLOSED CONTINUOUSLY) */}
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
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-slate-800/95 border-l-2 border-slate-600 rounded-r-3xl flex items-center justify-start pl-3 shadow-2xl z-20"
          >
            {/* Right Door Handle */}
            <div className="w-3 h-36 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-lg border border-slate-300" />

            {/* Door Interior Racks */}
            <div className="absolute right-2 top-10 bottom-10 w-12 border-r border-slate-700 opacity-40 flex flex-col justify-around">
              <div className="w-10 h-6 border border-slate-600 rounded-sm" />
              <div className="w-10 h-8 border border-slate-600 rounded-sm" />
              <div className="w-10 h-10 border border-slate-600 rounded-sm" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
