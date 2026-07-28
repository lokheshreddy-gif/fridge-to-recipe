import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, ArrowRight, Sun, Moon } from 'lucide-react';

export default function WelcomeFridgeIntro({ onComplete, theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenFridge = () => {
    setIsOpen(true);
    // Allow doors to swing open wide, then auto-advance to main app
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6 select-none transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}
    >
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <motion.button
          type="button"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2.5 px-3.5 rounded-2xl border font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
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

      {/* Background Glowing Ambient Aura */}
      <motion.div
        animate={{
          opacity: isOpen ? [0.4, 0.9, 0.6] : 0.3,
          scale: isOpen ? [1, 1.15, 1.05] : 1
        }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 blur-3xl pointer-events-none ${
          isLight
            ? 'bg-gradient-to-tr from-sky-200/50 via-indigo-200/40 to-teal-100/40'
            : 'bg-gradient-to-tr from-sky-500/30 via-indigo-600/30 to-teal-400/20'
        }`}
      />

      {/* FULL-SCREEN BACKGROUND ANIMATED FRIDGE DOORS (NO LINE CUTTING THROUGH CONTENT) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
        
        {/* LEFT DOOR (SWINGS LEFT) */}
        <motion.div
          animate={{
            rotateY: isOpen ? -115 : 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformOrigin: 'left center' }}
          className={`absolute top-0 bottom-0 left-0 w-1/2 shadow-2xl border-r-2 ${
            isLight
              ? 'bg-slate-100/90 border-slate-300'
              : 'bg-slate-900/95 border-slate-700'
          }`}
        />

        {/* RIGHT DOOR (SWINGS RIGHT) */}
        <motion.div
          animate={{
            rotateY: isOpen ? 115 : 0
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformOrigin: 'right center' }}
          className={`absolute top-0 bottom-0 right-0 w-1/2 shadow-2xl border-l-2 ${
            isLight
              ? 'bg-slate-100/90 border-slate-300'
              : 'bg-slate-900/95 border-slate-700'
          }`}
        />
      </div>

      {/* CLEAN UNCLUTTERED CARD CONTENT (POSITIONED ON TOP WITH ZERO SEAM OVERLAP) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-30 w-full max-w-md p-8 sm:p-10 rounded-3xl border shadow-2xl text-center space-y-6 backdrop-blur-xl ${
              isLight
                ? 'bg-white/95 border-slate-200 text-slate-900'
                : 'bg-slate-900/95 border-slate-800 text-white'
            }`}
          >
            {/* Single Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Easy Recipe Generator
            </div>

            {/* Clean Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Open Your Fridge
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover instant easy recipes from the food you already have.
              </p>
            </div>

            {/* Single Primary Action Button */}
            <motion.button
              type="button"
              onClick={handleOpenFridge}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-base shadow-xl hover:shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200"
            >
              <Utensils className="w-5 h-5" />
              <span>Open Fridge & Start Cooking</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
