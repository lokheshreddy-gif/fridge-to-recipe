import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UtensilsCrossed, XCircle } from 'lucide-react';

const CHEF_TIPS = [
  "Tip: Pat meat dry with paper towels before searing for a deep, delicious crust.",
  "Tip: Always salt your pasta water until it tastes like the ocean.",
  "Tip: Let grilled chicken rest for 5 minutes so juices redistribute evenly.",
  "Tip: A splash of lemon juice at the end brightens up rich garlic butter sauces.",
  "Tip: Save pasta water! The starch creates silky, glossy restaurant-style sauce."
];

export default function LoadingState({ onCancel }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CHEF_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 radial-glow relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col items-center text-center relative z-10"
      >
        {/* Animated Central Chef Icon */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/40 flex items-center justify-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white"
            >
              <UtensilsCrossed className="w-7 h-7" />
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Generating Recipe
          <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
        </h2>
        <p className="text-slate-400 text-sm mt-1.5 mb-6">
          Our AI Chef is pairing your ingredients into a culinary masterwork...
        </p>

        {/* Skeleton Card Simulation */}
        <div className="w-full space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-800/60 rounded-md w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="h-3 bg-slate-800/50 rounded-md w-full animate-pulse mt-4" />
          <div className="h-3 bg-slate-800/50 rounded-md w-5/6 animate-pulse" />
        </div>

        {/* Chef Tip Carousel */}
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-indigo-300 font-medium bg-indigo-500/10 border border-indigo-500/20 px-4 py-2.5 rounded-xl max-w-md"
        >
          {CHEF_TIPS[tipIndex]}
        </motion.div>

        {/* Cancel Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            Cancel request
          </button>
        )}
      </motion.div>
    </div>
  );
}
