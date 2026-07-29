import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, Plus, Trash2, Clock, Sparkles, AlertCircle, Lightbulb, Check, AlertTriangle, ShieldAlert, ImagePlus, Video } from 'lucide-react';

const QUICK_LEFTOVER_SUGGESTIONS = [
  { name: 'Cooked Rice', icon: '🍚', defaultQty: '2 cups', daysOld: 1, freshness: 'Fresh Today' },
  { name: 'Leftover Chicken', icon: '🍗', defaultQty: '300g', daysOld: 2, freshness: 'Use Soon (1-2 days)' },
  { name: 'Cooked Vegetables', icon: '🥦', defaultQty: '1 bowl', daysOld: 1, freshness: 'Fresh Today' },
  { name: 'Leftover Naan/Roti', icon: '🫓', defaultQty: '3 pieces', daysOld: 3, freshness: '3 Days Old (Use Quickly!)' },
  { name: 'Cooked Beans/Dal', icon: '🫘', defaultQty: '1 cup', daysOld: 1, freshness: 'Fresh Today' },
  { name: 'Leftover Pasta', icon: '🍝', defaultQty: '1.5 cups', daysOld: 2, freshness: 'Use Soon (1-2 days)' },
  { name: 'Boiled Potatoes', icon: '🥔', defaultQty: '4 items', daysOld: 1, freshness: 'Fresh Today' },
  { name: 'Leftover Curry', icon: '🍳', defaultQty: '1 bowl', daysOld: 3, freshness: '3 Days Old (Use Quickly!)' }
];

const UNCOOKED_KEYWORDS = ['raw', 'uncooked', 'frozen raw', 'unboiled', 'fresh meat'];

const COMPLEMENTARY_PAIRINGS = {
  'cooked rice': [
    { name: 'Leftover Curry', icon: '🍳', qty: '1 bowl' },
    { name: 'Curd / Yogurt', icon: '🥛', qty: '1 cup' },
    { name: 'Ghee / Butter', icon: '🧈', qty: '1 spoon' }
  ],
  'leftover chicken': [
    { name: 'Cooked Rice', icon: '🍚', qty: '2 cups' },
    { name: 'Tortilla / Roti Wrap', icon: '🫓', qty: '2 wraps' }
  ],
  'cooked vegetables': [
    { name: 'Cooked Rice', icon: '🍚', qty: '1.5 cups' },
    { name: 'Boiled Potatoes', icon: '🥔', qty: '2 items' }
  ]
};

export default function LeftoverSelector({
  leftoversList,
  onAddLeftover,
  onRemoveLeftover,
  onClearAll,
  onOpenUpload,
  onOpenCamera,
  errorMsg
}) {
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('1 portion');
  const [customDays, setCustomDays] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [complementaryItems, setComplementaryItems] = useState([]);

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

  const validateAndAdd = (name, qty, days = 1) => {
    if (!name || !name.trim()) return;
    const lower = name.toLowerCase().trim();
    
    if (UNCOOKED_KEYWORDS.some((kw) => lower.includes(kw))) {
      setValidationError('Please select cooked or ready-to-eat leftover items (no raw foods).');
      return;
    }

    if (leftoversList.length >= 10) {
      setValidationError('Max 10 items. Remove one to add another');
      return;
    }

    setValidationError('');
    const freshnessTag = days >= 3 ? `${days} Days Old (Use Quickly!)` : days === 2 ? 'Use Soon (1-2 days)' : 'Fresh Today';
    onAddLeftover(name.trim(), qty, freshnessTag);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    validateAndAdd(customName.trim(), customQty || '1 portion', customDays);
    setCustomName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Cooked Theme Banner in Warm Orange/Terracotta #E07A5F */}
      <div className="p-4 rounded-2xl bg-[#E07A5F]/10 border border-[#E07A5F]/40 text-slate-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <Recycle className="w-5 h-5 text-[#E07A5F] shrink-0 animate-spin-slow" />
          <span>
            <strong className="font-extrabold text-[#E07A5F]">Zero-Waste Leftover Mode:</strong> Track cooked leftovers & generate 15-30 min meals that use 100% of your items!
          </span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E07A5F] text-white shrink-0 shadow-sm">
          Cooked Theme (#E07A5F)
        </span>
      </div>

      {/* Quick Add Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E07A5F]" />
            <span>Popular Cooked Leftovers Quick-Add:</span>
          </label>
          <div className="flex items-center gap-2">
            {onOpenCamera && (
              <button
                type="button"
                onClick={onOpenCamera}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold flex items-center gap-1 hover:bg-amber-200 cursor-pointer transition-all"
                title="Scan Live Camera"
              >
                <Video className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Live Scan</span>
              </button>
            )}
            {onOpenUpload && (
              <button
                type="button"
                onClick={onOpenUpload}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold flex items-center gap-1 hover:bg-amber-200 cursor-pointer transition-all"
                title="Upload Leftover Food Photo"
              >
                <ImagePlus className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Add Photo</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {QUICK_LEFTOVER_SUGGESTIONS.map((item) => {
            const isAdded = leftoversList.some((l) => l.name.toLowerCase() === item.name.toLowerCase());
            return (
              <motion.button
                key={item.name}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isAdded) validateAndAdd(item.name, item.defaultQty, item.daysOld);
                }}
                disabled={isAdded}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                  isAdded
                    ? 'bg-amber-200/60 dark:bg-amber-950/80 border-amber-400/50 text-amber-900 dark:text-amber-300 opacity-60 cursor-not-allowed'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isAdded ? <Check className="w-3.5 h-3.5 text-[#E07A5F]" /> : <Plus className="w-3.5 h-3.5 text-[#E07A5F]" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Leftover Input */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type leftover (e.g. Cooked Egg Curry)..."
          className="sm:col-span-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white font-medium text-sm outline-none focus:ring-2 focus:ring-[#E07A5F]"
        />
        <select
          value={customQty}
          onChange={(e) => setCustomQty(e.target.value)}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-[#E07A5F]"
        >
          <option value="1 portion">1 portion</option>
          <option value="1 cup">1 cup</option>
          <option value="2 cups">2 cups</option>
          <option value="1 bowl">1 bowl</option>
          <option value="200g">200g</option>
          <option value="500g">500g</option>
        </select>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddCustom();
          }}
          className="py-3.5 px-4 rounded-xl bg-[#E07A5F] hover:bg-[#d46a4e] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Leftover</span>
        </button>
      </div>

      {/* Validation Error Message */}
      <AnimatePresence>
        {(validationError || errorMsg) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{validationError || errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Complementary Leftovers */}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    validateAndAdd(comp.name, comp.qty, 1);
                  }}
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

      {/* Selected Leftovers List Display */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Selected Leftovers ({leftoversList.length}/10):
          </span>
          {leftoversList.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAll();
              }}
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {leftoversList.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800/60 text-center space-y-2 bg-amber-50/40 dark:bg-amber-950/20">
            <Recycle className="w-8 h-8 text-[#E07A5F] mx-auto animate-pulse" />
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
              No leftovers added yet — Click quick-add buttons above or type leftovers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leftoversList.map((item) => {
              const isOld = item.freshness?.includes('3 Days') || item.freshness?.includes('Quickly');
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm flex items-center justify-between gap-2 hover:shadow-md transition-all ${
                    isOld ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40' : 'border-amber-200 dark:border-amber-800/80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span className="text-amber-800 dark:text-amber-300 font-extrabold bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                        {item.quantity}
                      </span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 font-extrabold ${isOld ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isOld ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <Clock className="w-3 h-3 text-emerald-500" />}
                        {item.freshness}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveLeftover(item.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
