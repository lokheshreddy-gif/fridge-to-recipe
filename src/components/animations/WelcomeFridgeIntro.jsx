import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, ArrowRight, Zap } from 'lucide-react';

export default function WelcomeFridgeIntro({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenFridge = () => {
    setIsOpen(true);
    // Allow doors to swing open wide, then trigger completion
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden p-4 select-none"
    >
      {/* Background Glowing LED Aura */}
      <motion.div
        animate={{
          opacity: isOpen ? [0.4, 1, 0.8] : 0.3,
          scale: isOpen ? [1, 1.2, 1.1] : 1
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 via-indigo-600/30 to-emerald-400/20 blur-3xl pointer-events-none"
      />

      {/* Main 3D Refrigerator Container */}
      <div className="relative w-full max-w-lg h-[520px] sm:h-[580px] flex flex-col items-center justify-center">

        {/* Interior Fridge Cabinet Content (Revealed when doors open) */}
        <div className="absolute inset-4 bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Top Freezer */}
          <div className="w-full h-32 bg-sky-950/80 border-b-2 border-slate-700 rounded-2xl flex items-center justify-around px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400/30 to-transparent pointer-events-none" />
            <span className="text-3xl animate-bounce">🧊</span>
            <span className="text-3xl animate-pulse">🍦</span>
            <span className="text-3xl">🍇</span>
          </div>

          {/* Main Shelves */}
          <div className="flex-1 py-4 flex flex-col justify-around relative">
            <div className="w-full h-2 bg-slate-700 rounded-full flex items-center justify-around px-4">
              <span className="text-3xl -mt-8">🥦</span>
              <span className="text-3xl -mt-8">🍅</span>
              <span className="text-3xl -mt-8">🧀</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full flex items-center justify-around px-4">
              <span className="text-3xl -mt-8">🥚</span>
              <span className="text-3xl -mt-8">🥛</span>
              <span className="text-3xl -mt-8">🍋</span>
            </div>

            {/* Crisper Drawers */}
            <div className="w-full h-20 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-around">
              <span className="text-2xl font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                🥬 Fresh Veggies
              </span>
            </div>
          </div>

          {/* Light Stream burst when doors open */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-t from-sky-300/40 via-white/30 to-transparent pointer-events-none blur-xl"
              />
            )}
          </AnimatePresence>
        </div>

        {/* LEFT FRIDGE DOOR (3D SWING OPEN) */}
        <motion.div
          animate={{
            rotateY: isOpen ? -130 : 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformOrigin: 'left center' }}
          className="absolute inset-y-4 left-4 w-1/2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-r-2 border-slate-600 rounded-l-3xl p-6 flex flex-col justify-between shadow-2xl z-30"
        >
          {/* Brand Logo & Temp Display */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">SMART FRIDGE</span>
          </div>

          {/* Door Handle */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-44 bg-gradient-to-b from-slate-400 via-slate-100 to-slate-400 rounded-full shadow-2xl border border-slate-300 flex items-center justify-center">
            <div className="w-1.5 h-20 bg-slate-600/40 rounded-full" />
          </div>

          {/* Bottom Badge */}
          <div className="text-[10px] font-bold text-slate-400">
            Temp: 36°F
          </div>
        </motion.div>

        {/* RIGHT FRIDGE DOOR (3D SWING OPEN) */}
        <motion.div
          animate={{
            rotateY: isOpen ? 130 : 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformOrigin: 'right center' }}
          className="absolute inset-y-4 right-4 w-1/2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-l-2 border-slate-600 rounded-r-3xl p-6 flex flex-col justify-between shadow-2xl z-30"
        >
          {/* Digital Status */}
          <div className="text-right">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              READY
            </span>
          </div>

          {/* Door Handle */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-44 bg-gradient-to-b from-slate-400 via-slate-100 to-slate-400 rounded-full shadow-2xl border border-slate-300 flex items-center justify-center">
            <div className="w-1.5 h-20 bg-slate-600/40 rounded-full" />
          </div>

          {/* Bottom Water Dispenser Graphic */}
          <div className="w-10 h-14 bg-slate-950/80 rounded-lg border border-slate-700 ml-auto flex items-center justify-center">
            <div className="w-2 h-4 bg-sky-400/60 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* OPEN FRIDGE BUTTON & TEXT OVERLAY */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute z-40 flex flex-col items-center text-center px-4 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              Welcome to AI Smart Fridge
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
              Open Your Fridge! 🧊
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-xs leading-relaxed">
              Tap the button to open the fridge doors & start cooking easy recipes!
            </p>

            <motion.button
              type="button"
              onClick={handleOpenFridge}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-base shadow-2xl hover:shadow-indigo-500/50 cursor-pointer flex items-center gap-3 active:scale-95 transition-all border border-white/20"
            >
              <Utensils className="w-5 h-5" />
              Open Fridge Doors
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
