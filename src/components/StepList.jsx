import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Utensils, CheckCircle2 } from 'lucide-react';

export default function StepList({ steps, checkedSteps, onToggleStep }) {
  const completedCount = steps.filter((step) => checkedSteps[step.id]).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Step Header & Live Animated Progress Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-700/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-indigo-400" />
            Cooking Steps ({completedCount}/{steps.length} completed)
          </h3>
          <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-sm shadow-indigo-500/50"
          />
        </div>
      </div>

      {/* Step Cards List */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isChecked = !!checkedSteps[step.id];

          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              onClick={() => onToggleStep(step.id)}
              className={`glass-card rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                isChecked
                  ? 'bg-slate-900/80 border-emerald-500/40 shadow-inner'
                  : 'hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              {/* Checkbox Icon */}
              <button
                type="button"
                className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                  isChecked
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'border-slate-600 bg-slate-800 text-transparent hover:border-indigo-500'
                }`}
              >
                <AnimatePresence>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isChecked ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    Step {idx + 1}
                  </span>
                  {step.durationMinutes && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {step.durationMinutes} min
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm sm:text-base leading-relaxed transition-all duration-200 ${
                    isChecked
                      ? 'line-through text-slate-500 font-normal'
                      : 'text-slate-200 font-medium'
                  }`}
                >
                  {step.instruction}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {completedCount === steps.length && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 font-bold text-sm text-center shadow-lg"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Bon Appétit! All cooking steps completed!
        </motion.div>
      )}
    </div>
  );
}
