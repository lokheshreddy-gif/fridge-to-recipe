import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Plus, Trash2, Clock, Sparkles, AlertCircle, Lightbulb, Check } from 'lucide-react';

const QUICK_LEFTOVER_SUGGESTIONS = [
  { name: 'Cooked Rice', icon: '🍚', defaultQty: '2 cups', freshness: 'Fresh Today' },
  { name: 'Leftover Chicken', icon: '🍗', defaultQty: '300g', freshness: 'Use Soon (1-2 days)' },
  { name: 'Cooked Vegetables', icon: '🥦', defaultQty: '1 bowl', freshness: 'Fresh Today' },
  { name: 'Leftover Naan/Roti', icon: '🫓', defaultQty: '3 pieces', freshness: 'Use Soon (1-2 days)' },
  { name: 'Cooked Beans/Dal', icon: '🫘', defaultQty: '1 cup', freshness: 'Fresh Today' },
  { name: 'Leftover Pasta', icon: '🍝', defaultQty: '1.5 cups', freshness: 'Use Soon (1-2 days)' },
  { name: 'Boiled Potatoes', icon: '🥔', defaultQty: '4 items', freshness: 'Fresh Today' },
  { name: 'Leftover Curry', icon: '🍳', defaultQty: '1 bowl', freshness: 'Use Soon (1-2 days)' }
];

const COMPLEMENTARY_PAIRINGS = {
  'cooked rice': [
    { name: 'Leftover Curry', icon: '🍳', qty: '1 bowl' },
    { name: 'Curd / Yogurt', icon: '🥛', qty: '1 cup' },
    { name: 'Ghee / Butter', icon: '🧈', qty: '1 spoon' },
    { name: 'Leftover Dal', icon: '🍲', qty: '1 cup' }
  ],
  'leftover chicken': [
    { name: 'Cooked Rice', icon: '🍚', qty: '2 cups' },
    { name: 'Tortilla / Roti Wrap', icon: '🫓', qty: '2 wraps' },
    { name: 'Cheese Slice', icon: '🧀', qty: '2 slices' }
  ],
  'cooked vegetables': [
    { name: 'Cooked Rice', icon: '🍚', qty: '1.5 cups' },
    { name: 'Leftover Pasta', icon: '🍝', qty: '1 cup' },
    { name: 'Boiled Potatoes', icon: '🥔', qty: '2 items' }
  ],
  'leftover naan/roti': [
    { name: 'Leftover Curry', icon: '🍳', qty: '1 bowl' },
    { name: 'Leftover Paneer', icon: '🧀', qty: '150g' }
  ]
};

export default function LeftoverSelector({
  leftoversList,
  onAddLeftover,
  onRemoveLeftover,
  onClearAll,
  errorMsg
}) {
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('1 portion');
  const [complementaryItems, setComplementaryItems] = useState([]);

  // Fetch or calculate complementary leftover suggestions
  useEffect(() => {
    if (leftoversList.length === 0) {
      setComplementaryItems([]);
      return;
    }

    const suggestionsMap = new Map();
    leftoversList.forEach((item) => {
      const key = item.name.toLowerCase();
      const pairings = COMPLEMENTARY_PAIRINGS[key] || [];
      pairings.forEach((p) => {
        const isAlreadyAdded = leftoversList.some((existing) => existing.name.toLowerCase() === p.name.toLowerCase());
        if (!isAlreadyAdded) {
          suggestionsMap.set(p.name, p);
        }
      });
    });

    setComplementaryItems(Array.from(suggestionsMap.values()).slice(0, 4));
  }, [leftoversList]);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddLeftover(customName.trim(), customQty || '1 portion', 'Fresh Today');
    setCustomName('');
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Cooked Theme Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <Recycle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-spin-slow" />
          <span>
            <strong className="font-extrabold text-amber-700 dark:text-amber-400">Zero-Waste Mode:</strong> Select leftovers from your fridge. Our AI chef will craft 15–30 min recipes using 100% leftovers!
          </span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-600 text-white shrink-0">
          Cooked Theme
        </span>
      </div>

      {/* Quick Add Suggestions */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Popular Leftovers Quick-Add:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_LEFTOVER_SUGGESTIONS.map((item) => {
            const isAdded = leftoversList.some((l) => l.name.toLowerCase() === item.name.toLowerCase());
            return (
              <motion.button
                key={item.name}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => !isAdded && onAddLeftover(item.name, item.defaultQty, item.freshness)}
                disabled={isAdded}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                  isAdded
                    ? 'bg-amber-200/60 dark:bg-amber-950/80 border-amber-400/50 text-amber-900 dark:text-amber-300 opacity-60 cursor-not-allowed'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isAdded ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Plus className="w-3.5 h-3.5 text-amber-600" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Leftover Input */}
      <form onSubmit={handleAddCustom} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Type custom leftover item (e.g. Boiled Egg)..."
          className="sm:col-span-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white font-medium text-sm outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={customQty}
          onChange={(e) => setCustomQty(e.target.value)}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="1 portion">1 portion</option>
          <option value="1 cup">1 cup</option>
          <option value="2 cups">2 cups</option>
          <option value="1 bowl">1 bowl</option>
          <option value="200g">200g</option>
          <option value="500g">500g</option>
        </select>
        <button
          type="submit"
          className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer transition-all shadow-md active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Leftover</span>
        </button>
      </form>

      {/* Complementary Leftovers Recommendations */}
      <AnimatePresence>
        {complementaryItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 space-y-2.5 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-300">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              <span>Smart Complementary Pairings:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {complementaryItems.map((comp) => (
                <button
                  key={comp.name}
                  type="button"
                  onClick={() => onAddLeftover(comp.name, comp.qty, 'Fresh Today')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 hover:bg-orange-100 cursor-pointer transition-all"
                >
                  <span>{comp.icon}</span>
                  <span>{comp.name}</span>
                  <Plus className="w-3 h-3 text-orange-600" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Leftovers List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Selected Leftovers ({leftoversList.length}/10):
          </span>
          {leftoversList.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {leftoversList.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800/60 text-center text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
            No leftover items selected yet. Click quick-add buttons above or type custom leftovers.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leftoversList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 shadow-sm flex items-center justify-between gap-2 hover:border-amber-400 transition-all"
              >
                <div className="space-y-0.5">
                  <span className="text-sm font-black text-slate-900 dark:text-white block">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <span className="text-amber-700 dark:text-amber-400 font-extrabold bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                      {item.quantity}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {item.freshness}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveLeftover(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
