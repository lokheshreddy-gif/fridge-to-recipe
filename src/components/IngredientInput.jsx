import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, AlertCircle, RefreshCw, AlertTriangle, History, Flame, Users2, ArrowRight } from 'lucide-react';

const HERO_DISH_CARDS = [
  {
    id: 'pulao',
    title: 'Veg Pulao & Basmati Rice',
    desc: 'Basmati rice, green peas, carrots, ghee & spices',
    badge: 'Popular',
    query: 'Veg pulao, basmati rice, green peas, carrots, ghee, whole spices',
    photo: '/ingredient-images/vegetable.png',
    cardBg: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/40',
    badgeBg: 'bg-amber-600 text-white'
  },
  {
    id: 'omelette',
    title: 'Fluffy Herb Omelette',
    desc: 'Fresh eggs, cheddar cheese, cherry tomatoes & butter',
    badge: 'Quick 10m',
    query: 'Eggs, cheddar cheese, cherry tomatoes, butter, salt, chives',
    photo: '/ingredient-images/salt.png',
    cardBg: 'bg-yellow-50/80 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-500/40',
    badgeBg: 'bg-yellow-600 text-white'
  },
  {
    id: 'pasta',
    title: 'Garlic Olive Oil Pasta',
    desc: 'Spaghetti, garlic cloves, olive oil & red chili flakes',
    badge: 'Classic',
    query: 'Spaghetti, garlic, olive oil, red chili flakes, parmesan cheese',
    photo: '/ingredient-images/oil.png',
    cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-600 text-white'
  },
  {
    id: 'tofu',
    title: 'Tofu & Broccoli Stir-Fry',
    desc: 'Firm tofu, broccoli, soy sauce & fresh ginger',
    badge: 'Healthy',
    query: 'Firm tofu, broccoli, soy sauce, fresh ginger, sesame oil',
    photo: '/ingredient-images/spinach.png',
    cardBg: 'bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-500/40',
    badgeBg: 'bg-indigo-600 text-white'
  }
];

const AGE_GROUPS = ['Child', 'Teen', 'Adult', 'Senior'];

export default function IngredientInput({
  onSubmit,
  isLoading,
  recentHistory = [],
  onSelectHistory
}) {
  const [ingredientsText, setIngredientsText] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('Adult');
  const [touched, setTouched] = useState(false);
  const [testMode, setTestMode] = useState('normal');
  const [showHistory, setShowHistory] = useState(false);

  const isEmpty = !ingredientsText.trim();
  const showError = touched && isEmpty;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isEmpty || isLoading) return;
    console.log('[Form Submit] Raw Ingredients Input Payload:', ingredientsText);
    onSubmit(ingredientsText, selectedAgeGroup, testMode === 'normal' ? null : testMode);
  };

  const handleSelectPreset = (presetText) => {
    console.log('[Preset Selected] Text:', presetText);
    setIngredientsText(presetText);
    setTouched(false);
    onSubmit(presetText, selectedAgeGroup, testMode === 'normal' ? null : testMode);
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 radial-glow relative overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative z-10 my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            AI Culinary Studio
          </div>

          <div className="flex items-center gap-2">
            {/* Recent History Toggle */}
            {recentHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg px-2.5 py-1 hover:text-indigo-600 transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-indigo-500" />
                History ({recentHistory.length})
              </button>
            )}

            {/* Test mode selector */}
            <select
              value={testMode}
              onChange={(e) => setTestMode(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
            >
              <option value="normal">Normal Mode</option>
              <option value="broken_json">Test: Broken JSON</option>
              <option value="invalid_schema">Test: Invalid Schema</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-indigo-200 tracking-tight">
          What’s in your fridge?
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-2 mb-6 leading-relaxed font-semibold">
          Search any dish name (e.g. <strong className="text-slate-900 dark:text-white">"veg pulao"</strong>, <strong className="text-slate-900 dark:text-white">"omelette"</strong>) or paste fridge ingredients. Our AI Chef will transform them into an interactive cooking sequence!
        </p>

        {/* Recent Search History Dropdown Drawer */}
        <AnimatePresence>
          {showHistory && recentHistory.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-4 rounded-2xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-slate-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-500" />
                  Recent Search History
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Click to re-populate</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recentHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIngredientsText(item.text);
                      setShowHistory(false);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/60 border border-slate-200 dark:border-slate-700/80 cursor-pointer flex items-center justify-between gap-2 text-slate-900 dark:text-slate-200 hover:text-indigo-600 transition-all font-bold"
                  >
                    <span className="truncate max-w-md">{item.text}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className={`glass-input rounded-2xl p-1 transition-all bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 ${showError ? 'ring-2 ring-rose-500 border-rose-500' : ''}`}>
              <textarea
                value={ingredientsText}
                onChange={(e) => {
                  setIngredientsText(e.target.value);
                  if (touched) setTouched(false);
                }}
                placeholder="e.g. veg pulao, 2 chicken breasts, garlic cloves, fresh spinach, basmati rice, eggs..."
                rows={3}
                className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 text-base p-4 outline-none resize-none font-bold leading-relaxed"
                autoFocus
              />
            </div>

            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-600 text-xs mt-2 font-black px-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Please enter a dish name or ingredient before cooking.
              </motion.div>
            )}
          </div>

          {/* Age Group Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-indigo-500" />
              Target Age Group for Nutrition Guidance:
            </label>
            <div className="flex gap-1.5">
              {AGE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSelectedAgeGroup(group)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedAgeGroup === group
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {group}
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
            className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              isEmpty
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700/40 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-indigo-500/25 cursor-pointer'
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
                Generate Recipe ({selectedAgeGroup})
              </>
            )}
          </motion.button>
        </form>

        {/* SWIGGY-INSPIRED HERO INSPIRATION CARDS UNDER SEARCH BAR */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Popular Dish & Ingredient Presets
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Click card to cook immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HERO_DISH_CARDS.map((card) => (
              <motion.div
                key={card.id}
                onClick={() => handleSelectPreset(card.query)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-sm hover:shadow-md ${card.cardBg} group`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 shrink-0">
                    <img src={card.photo} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                        {card.title}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${card.badgeBg} shrink-0 shadow-xs`}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {testMode !== 'normal' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-black">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Test Mode Active: This submit will simulate a <strong>{testMode}</strong> failure.</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
