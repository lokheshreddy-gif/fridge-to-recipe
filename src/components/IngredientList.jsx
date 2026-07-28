import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RefreshCw, Layers } from 'lucide-react';
import { getIngredientIcon } from './icons/AnimatedIcons.jsx';

export default function IngredientList({ ingredients, baseServings, currentServings, swaps = [] }) {
  const [expandedSwaps, setExpandedSwaps] = useState({});

  const toggleSwap = (ingredientName) => {
    setExpandedSwaps((prev) => ({
      ...prev,
      [ingredientName]: !prev[ingredientName]
    }));
  };

  const getSwapsForIngredient = (ingName) => {
    if (!swaps || !Array.isArray(swaps)) return null;
    const match = swaps.find((s) => s.ingredient.toLowerCase() === ingName.toLowerCase());
    return match?.alternatives || null;
  };

  const formatAmount = (baseAmount) => {
    if (!baseAmount || isNaN(baseAmount)) return '';
    const scaled = (baseAmount * currentServings) / baseServings;
    
    // Format fractions nicely (e.g. 0.5 -> 1/2, 0.25 -> 1/4, 0.33 -> 1/3, 0.75 -> 3/4)
    const whole = Math.floor(scaled);
    const remainder = scaled - whole;
    
    if (Math.abs(remainder - 0.5) < 0.05) return whole > 0 ? `${whole} ½` : '½';
    if (Math.abs(remainder - 0.25) < 0.05) return whole > 0 ? `${whole} ¼` : '¼';
    if (Math.abs(remainder - 0.75) < 0.05) return whole > 0 ? `${whole} ¾` : '¾';
    if (Math.abs(remainder - 0.33) < 0.05) return whole > 0 ? `${whole} ⅓` : '⅓';
    
    // Default to clean decimal rounded to 2 places if necessary
    return Number(scaled.toFixed(scaled % 1 === 0 ? 0 : 2));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Ingredients ({ingredients.length})
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Click item for substitution swaps
        </span>
      </div>

      <div className="space-y-2.5">
        {ingredients.map((ing, idx) => {
          const alternatives = getSwapsForIngredient(ing.name);
          const isExpanded = !!expandedSwaps[ing.name];

          return (
            <motion.div
              key={ing.id || idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-card rounded-2xl border border-slate-700/60 overflow-hidden transition-all duration-200"
            >
              {/* Main Ingredient Row */}
              <div
                onClick={() => alternatives && toggleSwap(ing.name)}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 ${
                  alternatives ? 'cursor-pointer hover:bg-slate-800/80' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Animated SVG Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
                    {getIngredientIcon(ing.icon, ing.name)}
                  </div>

                  <div className="truncate">
                    <span className="text-sm font-semibold text-slate-100 block truncate">
                      {ing.name}
                    </span>
                    {alternatives && (
                      <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                        <RefreshCw className="w-3 h-3" />
                        {alternatives.length} swap suggestions available
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Amount Badge with live calculation */}
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-sm">
                    {formatAmount(ing.amount)} {ing.unit}
                  </div>

                  {alternatives && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Collapsible Swap Suggestions Accordion */}
              <AnimatePresence>
                {isExpanded && alternatives && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="bg-indigo-950/40 border-t border-indigo-500/20 px-4 py-3 text-xs"
                  >
                    <div className="font-semibold text-indigo-300 mb-2 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                      Possible Substitutions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {alternatives.map((alt, altIdx) => (
                        <span
                          key={altIdx}
                          className="bg-indigo-900/60 text-indigo-200 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
