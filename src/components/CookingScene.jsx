import React from 'react';
import { motion } from 'framer-motion';
import IngredientImage from './IngredientImage.jsx';

/**
 * Parses instruction text to identify mentioned recipe ingredients and the primary cooking action
 */
function parseStepContext(instruction = '', ingredientsList = []) {
  const text = instruction.toLowerCase();

  // 1. Detect matching ingredients from recipe ingredients list
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
  } else if (/\b(sear|fry|saute|heat|brown|skillet|pan|sear|cook)\b/.test(text)) {
    actionType = 'sear';
  } else if (/\b(boil|simmer|reduce|poach|steam|water|broth|soup)\b/.test(text)) {
    actionType = 'boil';
  } else if (/\b(mix|stir|whisk|combine|toss|fold|blend|mash)\b/.test(text)) {
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

  // Robust display ingredients selection
  let displayIngredients = matchedIngredients.length > 0 
    ? matchedIngredients.slice(0, 3) 
    : (allIngredients.length > 0 ? allIngredients.slice(0, 3) : []);

  if (displayIngredients.length === 0) {
    displayIngredients = [
      { id: 'fallback-1', name: 'Fresh Ingredients', icon: 'vegetable' }
    ];
  }

  return (
    <div className="relative w-full max-w-xl h-64 sm:h-72 bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-300 dark:border-slate-700/80 shadow-2xl overflow-hidden flex items-center justify-center p-4 transition-colors">
      
      {/* Dynamic Background Heat Glow */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          actionType === 'sear'
            ? 'bg-gradient-to-t from-amber-500/25 via-orange-500/10 to-transparent'
            : actionType === 'boil'
            ? 'bg-gradient-to-t from-sky-500/25 via-indigo-500/10 to-transparent'
            : actionType === 'mix'
            ? 'bg-gradient-to-t from-purple-500/25 via-indigo-500/10 to-transparent'
            : actionType === 'bake'
            ? 'bg-gradient-to-t from-orange-600/25 via-amber-500/10 to-transparent'
            : actionType === 'chop'
            ? 'bg-gradient-to-t from-emerald-500/25 via-teal-500/10 to-transparent'
            : 'bg-gradient-to-t from-indigo-500/25 to-transparent'
        }`}
      />

      {/* BACKGROUND PARTICLES & EFFECT LAYER */}
      
      {/* Sizzling Sparks for Frying */}
      {(actionType === 'sear' || actionType === 'default') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -60, -90],
                x: [(i % 2 === 0 ? 1 : -1) * 5, (i % 2 === 0 ? -1 : 1) * 15],
                opacity: [0, 0.9, 0],
                scale: [0.6, 1.2, 0.4]
              }}
              transition={{
                duration: 1.2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeOut'
              }}
              style={{ left: `${20 + i * 10}%` }}
              className="absolute bottom-16 w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-md shadow-amber-400/50"
            />
          ))}
        </div>
      )}

      {/* Steam & Bubbles for Boiling */}
      {actionType === 'boil' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [10, -75],
                x: [0, (i % 2 === 0 ? 10 : -10)],
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.5]
              }}
              transition={{
                duration: 1.6 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
              style={{ left: `${18 + i * 9}%` }}
              className="absolute bottom-20 w-5 h-5 rounded-full border border-sky-300/80 bg-sky-400/30 blur-xs"
            />
          ))}
        </div>
      )}

      {/* Swirling Liquid Rings for Mixing */}
      {actionType === 'mix' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="w-56 h-56 border-2 border-dashed border-purple-400/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="w-40 h-40 border border-dotted border-indigo-400/30 rounded-full absolute"
          />
        </div>
      )}

      {/* Oven Heating for Baking */}
      {actionType === 'bake' && (
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-12 top-6 h-3 bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500 rounded-full shadow-lg shadow-orange-500/70"
        />
      )}

      {/* Knife Slicing for Chopping */}
      {actionType === 'chop' && (
        <motion.div
          animate={{
            y: [-30, 20, -30],
            rotate: [-15, 5, -15]
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-16 z-30 pointer-events-none"
        >
          <div className="w-16 h-4 bg-slate-200 rounded-r-full border border-slate-400 shadow-lg relative">
            <div className="absolute -left-6 top-0 w-6 h-4 bg-amber-900 rounded-l-md" />
          </div>
        </motion.div>
      )}

      {/* COOKING VESSEL CONTAINER */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-6">
        
        {/* Vessel Graphic */}
        {actionType === 'sear' && (
          <div className="relative w-72 h-28 bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-b-3xl shadow-2xl flex items-center justify-center">
            <div className="absolute -left-14 top-3 w-14 h-5 bg-slate-300 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-700 rounded-l-md" />
            <div className="w-64 h-16 bg-gradient-to-r from-amber-200/50 via-slate-100 to-amber-200/50 dark:from-amber-950/70 dark:via-slate-900 dark:to-amber-950/70 rounded-b-2xl border-t border-amber-500/40" />
          </div>
        )}

        {actionType === 'boil' && (
          <div className="relative w-64 h-32 bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-b-2xl shadow-2xl flex items-end justify-center overflow-hidden">
            <div className="absolute -left-5 top-5 w-5 h-9 bg-slate-300 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-700 rounded-l-md" />
            <div className="absolute -right-5 top-5 w-5 h-9 bg-slate-300 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-700 rounded-r-md" />
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-full h-20 bg-sky-100/90 dark:bg-sky-950/90 border-t border-sky-400/50"
            />
          </div>
        )}

        {(actionType === 'mix' || actionType === 'default') && (
          <div className="relative w-68 h-32 bg-indigo-50 dark:bg-indigo-950/90 border-4 border-indigo-300 dark:border-indigo-500/60 rounded-b-full shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="w-56 h-20 bg-purple-100/60 dark:bg-purple-900/50 rounded-b-full border-t border-purple-400/40" />
          </div>
        )}

        {actionType === 'bake' && (
          <div className="relative w-72 h-36 bg-white dark:bg-slate-950 border-4 border-slate-300 dark:border-slate-700 rounded-2xl p-2 flex flex-col justify-between shadow-2xl">
            <div className="w-full h-2.5 bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600 rounded-full" />
            <div className="w-full h-20 bg-amber-100/60 dark:bg-amber-950/50 border border-amber-400/40 dark:border-amber-500/30 rounded-xl" />
            <div className="w-full h-2.5 bg-gradient-to-r from-orange-600 via-amber-300 to-orange-600 rounded-full" />
          </div>
        )}

        {actionType === 'chop' && (
          <div className="relative w-72 h-28 bg-amber-100 dark:bg-amber-950/90 border-4 border-amber-300 dark:border-amber-800/80 rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="w-64 h-20 bg-amber-200/50 dark:bg-amber-900/50 border border-amber-400/60 dark:border-amber-700/60 rounded-xl" />
          </div>
        )}

        {actionType === 'plate' && (
          <div className="relative w-72 h-28 bg-white dark:bg-slate-950 border-4 border-slate-300 dark:border-slate-300 rounded-full shadow-2xl flex items-center justify-center">
            <div className="w-56 h-18 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full" />
          </div>
        )}

        {/* CONTINUOUS ORBITAL MIXING INGREDIENTS LAYER */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 z-20 pointer-events-none">
          {displayIngredients.map((ing, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;

            const orbitX = isFirst ? [0, 24, 0, -24, 0] : isSecond ? [0, -24, 0, 24, 0] : [0, 12, -12, 12, 0];
            const orbitY = isFirst ? [0, -12, 8, -12, 0] : isSecond ? [0, 12, -8, 12, 0] : [-8, 8, -8, 8, -8];
            const orbitRotate = isFirst ? [-8, 8, -8] : isSecond ? [8, -8, 8] : [-4, 4, -4];

            return (
              <motion.div
                key={ing.id || idx}
                initial={{ y: -100, scale: 0.6, opacity: 0 }}
                animate={{
                  y: orbitY,
                  x: orbitX,
                  rotate: orbitRotate,
                  scale: 1,
                  opacity: 1
                }}
                transition={{
                  y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.1 },
                  x: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.1 },
                  rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                  scale: { duration: 0.5, delay: idx * 0.15 },
                  opacity: { duration: 0.4, delay: idx * 0.15 }
                }}
                className="relative"
              >
                {/* Ingredient Card Thumbnail */}
                <div className="bg-white dark:bg-slate-900/95 p-2 rounded-2xl border border-slate-300 dark:border-slate-700/90 shadow-2xl flex items-center gap-2 backdrop-blur-md">
                  <IngredientImage iconKeyword={ing.icon} name={ing.name} className="w-10 h-10 shrink-0" />
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100 max-w-24 truncate">
                    {ing.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ANIMATED STIRRING SPOON OVERLAY */}
        <motion.div
          animate={{
            x: [-35, 35, -35],
            y: [-12, 12, -12],
            rotate: [-18, 18, -18]
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute z-30 pointer-events-none -top-6"
        >
          <div className="relative w-8 h-36 flex flex-col items-center opacity-90 drop-shadow-2xl">
            <div className="w-9 h-12 bg-amber-800 border-2 border-amber-600 rounded-full shadow-md" />
            <div className="w-3 h-24 bg-amber-900 border border-amber-700 rounded-b-md -mt-2" />
          </div>
        </motion.div>

      </div>

      {/* SIMPLE ENGLISH TOP SCENE BADGE */}
      <div className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 text-[11px] font-black text-slate-900 dark:text-slate-100 shadow-md">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span className="uppercase tracking-wider">
          {actionType === 'sear'
            ? '🔥 Cooking in Pan'
            : actionType === 'boil'
            ? '🍲 Boiling in Pot'
            : actionType === 'mix'
            ? '🥣 Mixing in Bowl'
            : actionType === 'bake'
            ? '🔥 Oven Cooking'
            : actionType === 'chop'
            ? '🔪 Cutting Board'
            : actionType === 'plate'
            ? '🍽️ Ready to Eat'
            : '🍳 Cooking Scene'}
        </span>
      </div>

    </div>
  );
}
