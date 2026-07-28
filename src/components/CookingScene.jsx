import React from 'react';
import { motion } from 'framer-motion';
import IngredientImage from './IngredientImage.jsx';

/**
 * Parses instruction text to identify mentioned recipe ingredients and the primary culinary action
 */
function parseStepContext(instruction = '', ingredientsList = []) {
  const text = instruction.toLowerCase();

  // 1. Detect matching ingredients from recipe ingredients list (case-insensitive, length >= 2)
  const matchedIngredients = ingredientsList.filter((ing) => {
    if (!ing || !ing.name) return false;
    const name = ing.name.toLowerCase();
    const words = name.split(/[\s,/-]+/).filter((w) => w.length >= 2);
    return text.includes(name) || words.some((w) => text.includes(w));
  });

  // 2. Detect Action Keyword & Vessel Type
  let actionType = 'default';

  if (/\b(chop|dice|slice|cut|mince|peel|carve|prep)\b/.test(text)) {
    actionType = 'chop';
  } else if (/\b(sear|fry|saute|heat|brown|skillet|pan|sear)\b/.test(text)) {
    actionType = 'sear';
  } else if (/\b(boil|simmer|reduce|poach|steam|water)\b/.test(text)) {
    actionType = 'boil';
  } else if (/\b(mix|stir|whisk|combine|toss|fold|blend)\b/.test(text)) {
    actionType = 'mix';
  } else if (/\b(bake|roast|oven|broil|preheat)\b/.test(text)) {
    actionType = 'bake';
  } else if (/\b(plate|garnish|serve|finish|enjoy)\b/.test(text)) {
    actionType = 'plate';
  }

  return { matchedIngredients, actionType };
}

export default function CookingScene({ step, allIngredients = [] }) {
  const { matchedIngredients, actionType } = parseStepContext(step?.instruction || '', allIngredients);

  // Robust display ingredients selection — ALWAYS guaranteed non-empty!
  let displayIngredients = matchedIngredients.length > 0 
    ? matchedIngredients.slice(0, 3) 
    : (allIngredients.length > 0 ? allIngredients.slice(0, 2) : []);

  if (displayIngredients.length === 0) {
    console.warn(`[CookingScene] No ingredients found for step: "${step?.instruction}", using default ingredient fallback.`);
    displayIngredients = [
      { id: 'fallback-1', name: 'Fresh Ingredients', icon: 'vegetable' }
    ];
  }

  return (
    <div className="relative w-full max-w-lg h-60 sm:h-64 bg-slate-950 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background Radial Heat Glow */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          actionType === 'sear'
            ? 'bg-gradient-to-t from-amber-500/20 via-orange-500/10 to-transparent'
            : actionType === 'boil'
            ? 'bg-gradient-to-t from-sky-500/20 via-indigo-500/10 to-transparent'
            : actionType === 'mix'
            ? 'bg-gradient-to-t from-purple-500/20 via-indigo-500/10 to-transparent'
            : actionType === 'bake'
            ? 'bg-gradient-to-t from-orange-600/20 via-amber-500/10 to-transparent'
            : actionType === 'chop'
            ? 'bg-gradient-to-t from-emerald-500/20 via-teal-500/10 to-transparent'
            : actionType === 'plate'
            ? 'bg-gradient-to-t from-amber-400/20 via-indigo-500/10 to-transparent'
            : 'bg-gradient-to-t from-indigo-500/20 to-transparent'
        }`}
      />

      {/* AMBIENT LOOPING ANIMATIONS LAYER */}
      
      {/* Sizzle & Steam lines for Searing / Frying */}
      {actionType === 'sear' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -70],
                opacity: [0, 0.7, 0],
                scale: [0.8, 1.4]
              }}
              transition={{
                duration: 1.8 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeOut'
              }}
              style={{ left: `${25 + i * 14}%` }}
              className="absolute bottom-16 w-6 h-6 rounded-full bg-amber-400/20 blur-sm"
            />
          ))}
        </div>
      )}

      {/* Rising Steam & Bubbles for Boiling */}
      {actionType === 'boil' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [20, -60],
                opacity: [0, 0.8, 0],
                scale: [0.6, 1.2]
              }}
              transition={{
                duration: 1.4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeOut'
              }}
              style={{ left: `${20 + i * 12}%` }}
              className="absolute bottom-16 w-4 h-4 rounded-full border border-sky-300 bg-sky-400/30"
            />
          ))}
        </div>
      )}

      {/* Rotating Whisk / Stir Swirl for Mixing */}
      {actionType === 'mix' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="w-48 h-48 border-2 border-dashed border-purple-400/30 rounded-full" />
        </motion.div>
      )}

      {/* Oven Glowing Pulse for Baking */}
      {actionType === 'bake' && (
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-8 top-4 h-3 bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500 rounded-full shadow-lg shadow-orange-500/60"
        />
      )}

      {/* BASE VESSEL LAYER (Skillet, Pot, Bowl, Oven, Board, Plate) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Vessel Graphic */}
        {actionType === 'sear' && (
          <div className="relative w-64 h-24 bg-slate-900 border-4 border-slate-700 rounded-b-3xl shadow-2xl flex items-center justify-center">
            <div className="absolute -left-12 top-2 w-12 h-4 bg-slate-800 border-2 border-slate-700 rounded-l-md" />
            <div className="w-56 h-14 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 rounded-b-2xl border-t border-amber-500/30" />
          </div>
        )}

        {actionType === 'boil' && (
          <div className="relative w-56 h-28 bg-slate-900 border-4 border-slate-700 rounded-b-2xl shadow-2xl flex items-end justify-center overflow-hidden">
            <div className="absolute -left-4 top-4 w-4 h-8 bg-slate-800 border-2 border-slate-700 rounded-l-md" />
            <div className="absolute -right-4 top-4 w-4 h-8 bg-slate-800 border-2 border-slate-700 rounded-r-md" />
            <div className="w-full h-16 bg-sky-950/80 border-t border-sky-400/40" />
          </div>
        )}

        {actionType === 'mix' && (
          <div className="relative w-60 h-28 bg-indigo-950/90 border-4 border-indigo-500/60 rounded-b-full shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="w-48 h-16 bg-purple-900/40 rounded-b-full border-t border-purple-400/40" />
          </div>
        )}

        {actionType === 'bake' && (
          <div className="relative w-64 h-32 bg-slate-950 border-4 border-slate-700 rounded-2xl p-2 flex flex-col justify-between shadow-2xl">
            <div className="w-full h-2 bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600 rounded-full" />
            <div className="w-full h-16 bg-amber-950/40 border border-amber-500/30 rounded-xl" />
            <div className="w-full h-2 bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600 rounded-full" />
          </div>
        )}

        {actionType === 'chop' && (
          <div className="relative w-64 h-24 bg-amber-950/90 border-4 border-amber-800/80 rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="w-56 h-16 bg-amber-900/40 border border-amber-700/60 rounded-xl" />
          </div>
        )}

        {actionType === 'plate' && (
          <div className="relative w-64 h-24 bg-slate-950 border-4 border-slate-300 rounded-full shadow-2xl flex items-center justify-center">
            <div className="w-48 h-14 bg-slate-900 border border-slate-700 rounded-full" />
          </div>
        )}

        {actionType === 'default' && (
          <div className="relative w-56 h-28 bg-slate-900 border-4 border-indigo-500/50 rounded-b-2xl shadow-2xl flex items-end justify-center">
            <div className="w-full h-16 bg-indigo-950/60 border-t border-indigo-400/30" />
          </div>
        )}

        {/* INGREDIENTS DROPPING IN LAYER — Guaranteed non-empty */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 px-4 z-20">
          {displayIngredients.map((ing, idx) => {
            const isMeat = /chicken|beef|meat|steak|pork|fish|turkey/i.test(ing.name || ing.icon || '');

            return (
              <motion.div
                key={ing.id || idx}
                initial={{ y: -90, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + idx * 0.15,
                  type: 'spring',
                  bounce: 0.35
                }}
                className="relative"
              >
                {/* Ingredient Photographic Thumbnail / Icon Card */}
                <motion.div
                  animate={
                    isMeat && actionType === 'sear'
                      ? {
                          filter: [
                            'brightness(1) contrast(1)',
                            'brightness(0.85) sepia(0.6) hue-rotate(-20deg) contrast(1.2)'
                          ]
                        }
                      : {}
                  }
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                  className="bg-slate-900/90 p-2 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-2 backdrop-blur-md"
                >
                  <IngredientImage iconKeyword={ing.icon} name={ing.name} className="w-10 h-10" />
                  <span className="text-xs font-bold text-slate-100 max-w-24 break-words leading-tight pr-1">
                    {ing.name}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* TOP SCENE TYPE BADGE */}
      <div className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-bold text-slate-200 shadow-md">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
        <span className="uppercase tracking-wider">
          {actionType === 'sear'
            ? '🔥 Searing & Frying Pan'
            : actionType === 'boil'
            ? '🍲 Simmering Stockpot'
            : actionType === 'mix'
            ? '🥣 Mixing & Whisking Bowl'
            : actionType === 'bake'
            ? '⚡ Oven Bake Chamber'
            : actionType === 'chop'
            ? '🔪 Cutting & Prep Board'
            : actionType === 'plate'
            ? '✨ Plating & Serving'
            : '🍲 Cooking Pot'}
        </span>
      </div>
    </div>
  );
}
