import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Minus, Plus } from 'lucide-react';

export default function ServingsControl({ servings, baseServings, onServingsChange }) {
  const handleDecrement = () => {
    if (servings > 1) {
      onServingsChange(servings - 1);
    }
  };

  const handleIncrement = () => {
    if (servings < 20) {
      onServingsChange(servings + 1);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-700/60 shadow-md">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Recipe Scaling
            {servings !== baseServings && (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                Scaled x{(servings / baseServings).toFixed(2)}
              </span>
            )}
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Original recipe base: {baseServings} {baseServings === 1 ? 'serving' : 'servings'}
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Decrement Button */}
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={servings <= 1}
          whileHover={{ scale: servings > 1 ? 1.1 : 1 }}
          whileTap={{ scale: servings > 1 ? 0.9 : 1 }}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            servings <= 1
              ? 'border-slate-300 dark:border-slate-800 text-slate-400 bg-slate-100 dark:bg-slate-900/40 cursor-not-allowed'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Minus className="w-4 h-4" />
        </motion.button>

        {/* Animated Number Counter */}
        <div className="relative min-w-16 h-10 bg-slate-900 text-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden font-extrabold text-lg text-indigo-300 px-3 shadow-md">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={servings}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-black text-indigo-400"
            >
              {servings} <span className="text-xs font-bold text-slate-400">serv</span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Increment Button */}
        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={servings >= 20}
          whileHover={{ scale: servings < 20 ? 1.1 : 1 }}
          whileTap={{ scale: servings < 20 ? 0.9 : 1 }}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            servings >= 20
              ? 'border-slate-300 dark:border-slate-800 text-slate-400 bg-slate-100 dark:bg-slate-900/40 cursor-not-allowed'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
