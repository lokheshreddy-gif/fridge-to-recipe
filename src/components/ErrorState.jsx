import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RotateCcw, ShieldAlert, WifiOff, Clock } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  const isTimeout = error?.toLowerCase().includes('time') || error?.toLowerCase().includes('timeout');
  const isNetwork = error?.toLowerCase().includes('network') || error?.toLowerCase().includes('fetch');
  const isParse = error?.toLowerCase().includes('understand') || error?.toLowerCase().includes('json');

  const getIcon = () => {
    if (isTimeout) return <Clock className="w-8 h-8 text-amber-400" />;
    if (isNetwork) return <WifiOff className="w-8 h-8 text-rose-400" />;
    if (isParse) return <ShieldAlert className="w-8 h-8 text-purple-400" />;
    return <AlertOctagon className="w-8 h-8 text-rose-400" />;
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 radial-glow relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col items-center text-center relative z-10"
      >
        {/* Error Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center mb-5 shadow-inner">
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isParse
            ? "Couldn't understand that recipe"
            : isTimeout
            ? "Chef timed out"
            : "Recipe Generation Error"}
        </h2>

        {/* Error Message */}
        <p className="text-slate-300 text-sm sm:text-base mt-2.5 mb-6 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 w-full font-mono text-xs">
          {error || 'An unexpected error occurred while parsing the AI response.'}
        </p>

        {/* Action Button */}
        <motion.button
          type="button"
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
