import React from 'react';
import { motion } from 'framer-motion';

export default function OpeningFridgeScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:flex items-center justify-center opacity-25">
      <div className="relative w-full max-w-4xl h-96 flex items-center justify-center">
        
        {/* Soft Interior Fridge Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.9, 0.7], scale: [0.8, 1.05, 1] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-96 h-80 bg-gradient-to-tr from-sky-500/30 via-indigo-400/20 to-amber-300/20 rounded-3xl blur-3xl"
        />

        {/* Outer Fridge Frame SVG */}
        <div className="relative w-80 h-96 bg-slate-900/60 border-4 border-slate-700/60 rounded-3xl p-4 shadow-2xl flex flex-col justify-between">
          
          {/* Top Freezer Shelf */}
          <div className="w-full h-24 bg-slate-800/40 border-b-2 border-slate-700/60 rounded-t-2xl flex items-center justify-around px-4">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-8 bg-sky-400/20 rounded-lg border border-sky-300/40"
            />
            <div className="w-12 h-10 bg-amber-400/20 rounded-lg border border-amber-300/30" />
          </div>

          {/* Main Fridge Shelves */}
          <div className="flex-1 py-3 flex flex-col justify-around">
            {/* Shelf 1 */}
            <div className="w-full h-1 bg-slate-700/80 rounded-full relative">
              <div className="absolute bottom-1 left-4 w-10 h-10 bg-emerald-400/20 rounded-full border border-emerald-300/30" />
              <div className="absolute bottom-1 right-8 w-8 h-12 bg-indigo-400/20 rounded-md border border-indigo-300/30" />
            </div>

            {/* Shelf 2 */}
            <div className="w-full h-1 bg-slate-700/80 rounded-full relative">
              <div className="absolute bottom-1 left-12 w-12 h-8 bg-amber-500/20 rounded-lg border border-amber-400/30" />
            </div>

            {/* Crisper Drawer */}
            <div className="w-full h-16 bg-slate-800/60 border border-slate-700/60 rounded-b-xl flex items-center justify-around px-2">
              <div className="w-28 h-10 bg-emerald-500/15 rounded-lg border border-emerald-400/20" />
              <div className="w-28 h-10 bg-emerald-500/15 rounded-lg border border-emerald-400/20" />
            </div>
          </div>

          {/* Animated Swinging Fridge Door (One-Time Opening Entrance) */}
          <motion.div
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: -110, opacity: 0.15 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left center' }}
            className="absolute inset-0 bg-slate-800/90 border-4 border-slate-600 rounded-3xl flex items-center justify-end pr-4 shadow-2xl"
          >
            {/* Handle */}
            <div className="w-3 h-32 bg-slate-500 rounded-full shadow-md" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
