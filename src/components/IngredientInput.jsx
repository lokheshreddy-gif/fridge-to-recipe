import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';

const SAMPLE_PRESETS = [
  { name: '🍗 Chicken & Garlic', text: 'Chicken breast, garlic cloves, fresh spinach, lemon, olive oil, salt, black pepper' },
  { name: '🍳 Morning Omelette', text: 'Eggs, cheddar cheese, cherry tomatoes, bell pepper, butter, salt, chives' },
  { name: '🍝 Garlic Olive Oil Pasta', text: 'Spaghetti, garlic, olive oil, chili flakes, parsley, parmesan cheese, salt' },
  { name: '🥗 Mediterranean Bowl', text: 'Chickpeas, cucumber, cherry tomatoes, feta cheese, olive oil, lemon juice, garlic' }
];

export default function IngredientInput({ onSubmit, isLoading }) {
  const [ingredientsText, setIngredientsText] = useState('');
  const [touched, setTouched] = useState(false);
  const [testMode, setTestMode] = useState('normal');

  const isEmpty = !ingredientsText.trim();
  const showError = touched && isEmpty;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isEmpty || isLoading) return;
    onSubmit(ingredientsText, testMode === 'normal' ? null : testMode);
  };

  const handleSelectPreset = (presetText) => {
    setIngredientsText(presetText);
    setTouched(false);
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 radial-glow relative overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative z-10 my-auto"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            AI Culinary Assistant
          </div>
          
          {/* Test mode selector for failure testing */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium hidden sm:inline">Test Failures:</label>
            <select
              value={testMode}
              onChange={(e) => setTestMode(e.target.value)}
              className="bg-slate-900/80 text-xs text-slate-300 border border-slate-700/60 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
            >
              <option value="normal">Normal Mode</option>
              <option value="broken_json">Test: Broken JSON output</option>
              <option value="invalid_schema">Test: Invalid Schema</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
          What’s in your fridge?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 mb-6 leading-relaxed">
          Type or paste any ingredients you have on hand. Our AI Chef will transform them into an interactive, step-by-step recipe with scaling and ingredient swap ideas.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className={`glass-input rounded-2xl p-1 transition-all ${showError ? 'ring-2 ring-rose-500/50 border-rose-500/50' : ''}`}>
              <textarea
                value={ingredientsText}
                onChange={(e) => {
                  setIngredientsText(e.target.value);
                  if (touched) setTouched(false);
                }}
                placeholder="e.g. 2 chicken breasts, garlic cloves, fresh spinach, half a lemon, olive oil, salt, black pepper..."
                rows={5}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base p-4 outline-none resize-none font-medium leading-relaxed"
                autoFocus
              />
            </div>
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-medium px-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Please enter at least one ingredient before cooking.
              </motion.div>
            )}

            <div className="flex justify-between items-center px-2 mt-2 text-xs text-slate-500 font-medium">
              <span>Separating with commas or lines works best</span>
              <span>{ingredientsText.length} characters</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Quick Inspiration Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  className="text-xs bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            type="submit"
            disabled={isEmpty || isLoading}
            whileHover={!isEmpty && !isLoading ? { scale: 1.015 } : {}}
            whileTap={!isEmpty && !isLoading ? { scale: 0.98 } : {}}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              isEmpty
                ? 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-indigo-500/25 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Crafting Recipe...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                Generate Recipe
              </>
            )}
          </motion.button>
        </form>

        {testMode !== 'normal' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Test Mode Active: This submit will simulate a <strong>{testMode}</strong> failure to verify error handling.</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
