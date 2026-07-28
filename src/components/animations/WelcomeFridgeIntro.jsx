import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, ArrowRight, Sun, Moon } from 'lucide-react';

export default function WelcomeFridgeIntro({ onComplete, theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenFridge = () => {
    setIsOpen(true);
    // Allow doors to swing open wide, then trigger completion
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden p-4 select-none transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}
    >
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <motion.button
          type="button"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl transition-all ${
            isLight
              ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
              : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Light Theme</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Background Glowing LED Aura */}
      <motion.div
        animate={{
          opacity: isOpen ? [0.4, 1, 0.8] : 0.3,
          scale: isOpen ? [1, 1.2, 1.1] : 1
        }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 blur-3xl pointer-events-none ${
          isLight
            ? 'bg-gradient-to-tr from-sky-300/40 via-indigo-300/30 to-emerald-200/30'
            : 'bg-gradient-to-tr from-sky-500/30 via-indigo-600/30 to-emerald-400/20'
        }`}
      />

      {/* Main 3D Refrigerator Container */}
      <div className="relative w-full max-w-lg h-[520px] sm:h-[580px] flex flex-col items-center justify-center">

        {/* Interior Fridge Cabinet Content (Revealed when doors open) */}
        <div className={`absolute inset-4 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
        }`}>
          {/* Top Freezer */}
          <div className={`w-full h-32 border-b-2 rounded-2xl flex items-center justify-around px-4 relative ${
            isLight ? 'bg-sky-50 border-slate-300' : 'bg-sky-950/80 border-slate-700'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300/30 to-transparent pointer-events-none" />
            <span className="text-3xl animate-bounce">🧊</span>
            <span className="text-3xl animate-pulse">🍦</span>
            <span className="text-3xl">🍇</span>
          </div>

          {/* Main Shelves */}
          <div className={`flex-1 py-4 flex flex-col justify-around relative ${isLight ? 'bg-slate-50/80' : ''}`}>
            <div className={`w-full h-2 rounded-full flex items-center justify-around px-4 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
              <span className="text-3xl -mt-8">🥦</span>
              <span className="text-3xl -mt-8">🍅</span>
              <span className="text-3xl -mt-8">🧀</span>
            </div>
            <div className={`w-full h-2 rounded-full flex items-center justify-around px-4 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
              <span className="text-3xl -mt-8">🥚</span>
              <span className="text-3xl -mt-8">🥛</span>
              <span className="text-3xl -mt-8">🍋</span>
            </div>

            {/* Crisper Drawers */}
            <div className={`w-full h-20 rounded-xl flex items-center justify-around border ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
            }`}>
              <span className="text-2xl font-black uppercase tracking-widest flex items-center gap-1">
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
          className={`absolute inset-y-4 left-4 w-1/2 rounded-l-3xl p-6 flex flex-col justify-between shadow-2xl z-30 border-r-2 ${
            isLight
              ? 'bg-slate-100 border-slate-300'
              : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-slate-600'
          }`}
        >
          {/* Brand Logo & Temp Display */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className={`text-[10px] font-black tracking-widest uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              SMART FRIDGE
            </span>
          </div>

          {/* Door Handle */}
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-44 rounded-full shadow-2xl border flex items-center justify-center ${
            isLight
              ? 'bg-gradient-to-b from-indigo-500 via-indigo-300 to-indigo-500 border-indigo-400'
              : 'bg-gradient-to-b from-slate-400 via-slate-100 to-slate-400 border-slate-300'
          }`}>
            <div className="w-1.5 h-20 bg-slate-600/40 rounded-full" />
          </div>

          {/* Bottom Badge */}
          <div className={`text-[10px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
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
          className={`absolute inset-y-4 right-4 w-1/2 rounded-r-3xl p-6 flex flex-col justify-between shadow-2xl z-30 border-l-2 ${
            isLight
              ? 'bg-slate-100 border-slate-300'
              : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-slate-600'
          }`}
        >
          {/* Digital Status */}
          <div className="text-right">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30">
              READY
            </span>
          </div>

          {/* Door Handle */}
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-44 rounded-full shadow-2xl border flex items-center justify-center ${
            isLight
              ? 'bg-gradient-to-b from-indigo-500 via-indigo-300 to-indigo-500 border-indigo-400'
              : 'bg-gradient-to-b from-slate-400 via-slate-100 to-slate-400 border-slate-300'
          }`}>
            <div className="w-1.5 h-20 bg-slate-600/40 rounded-full" />
          </div>

          {/* Bottom Water Dispenser Graphic */}
          <div className={`w-10 h-14 rounded-lg border ml-auto flex items-center justify-center ${
            isLight ? 'bg-slate-200 border-slate-400' : 'bg-slate-950/80 border-slate-700'
          }`}>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-spin" />
              Welcome to AI Smart Fridge
            </div>

            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight drop-shadow-lg ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Open Your Fridge! 🧊
            </h1>

            <p className={`text-xs sm:text-sm font-extrabold max-w-xs leading-relaxed ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              Tap the button to open the fridge doors & start cooking easy recipes!
            </p>

            <motion.button
              type="button"
              onClick={handleOpenFridge}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-base shadow-2xl hover:shadow-indigo-500/50 cursor-pointer flex items-center gap-3 active:scale-95 transition-all border border-white/20"
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
