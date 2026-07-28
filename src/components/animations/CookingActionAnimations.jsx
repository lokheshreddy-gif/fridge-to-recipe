import React from 'react';
import { motion } from 'framer-motion';

// 1. Chop Animation: Knife chopping up/down over vegetable/ingredient
export function ChopAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-xl" />

      {/* Ingredient being chopped (Carrot/Leaf) */}
      <div className="absolute bottom-10 flex items-center gap-1">
        <div className="w-12 h-6 bg-amber-500 rounded-full border border-amber-400/80 shadow-md" />
        <div className="w-6 h-6 bg-amber-600 rounded-full border border-amber-500/80" />
        <div className="w-4 h-4 bg-amber-700 rounded-full" />
      </div>

      {/* Animated Knife Chopping Down & Up */}
      <motion.svg
        animate={{ y: [-25, 12, -25], rotate: [-10, 5, -10] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeIn' }}
        className="w-24 h-24 text-slate-100 z-10 filter drop-shadow-lg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" className="fill-slate-200 stroke-slate-300" />
        <path d="M13 19l6-6" className="stroke-amber-600 stroke-[3]" />
        <path d="M16 22l4-4" className="stroke-amber-700 stroke-[3]" />
      </motion.svg>

      {/* Chop Particle Sparks */}
      <motion.div
        animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute bottom-10 right-12 w-4 h-4 bg-amber-300 rounded-full blur-xs"
      />
    </div>
  );
}

// 2. Stir Animation: Bowl with a rotating spoon mixing motion
export function StirAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl" />

      {/* Bowl */}
      <div className="absolute bottom-8 w-28 h-14 bg-indigo-950/90 border-2 border-indigo-400/80 rounded-b-full shadow-inner flex items-center justify-center">
        {/* Swirling Sauce inside */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-6 rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 opacity-80 border border-purple-300/40"
        />
      </div>

      {/* Rotating Spoon */}
      <motion.svg
        animate={{
          rotate: [0, 25, 0, -25, 0],
          x: [-8, 8, -8],
          y: [-4, 4, -4]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 text-slate-200 z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2v12" className="stroke-slate-300 stroke-[2.5]" />
        <ellipse cx="12" cy="17" rx="3.5" ry="4.5" className="fill-slate-300 stroke-slate-200" />
      </motion.svg>
    </div>
  );
}

// 3. Heat Animation (Sear / Fry / Saute): Pan with wavy heat lines & flickering flame
export function HeatAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-amber-500/15 rounded-3xl blur-xl" />

      {/* Flickering Flame under skillet */}
      <div className="absolute bottom-4 flex items-center gap-1.5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.4 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
            className="w-4 h-7 rounded-t-full bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300 shadow-md"
          />
        ))}
      </div>

      {/* Searing Pan */}
      <div className="relative w-28 h-8 bg-slate-800 border-2 border-slate-600 rounded-b-xl shadow-lg flex items-center justify-center z-10">
        <div className="w-16 h-3 bg-amber-500/40 rounded-full animate-pulse" />
      </div>

      {/* Rising Heat Lines */}
      {[...Array(3)].map((_, i) => (
        <motion.svg
          key={i}
          animate={{ y: [-5, -25], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.35 }}
          style={{ left: `${30 + i * 20}%` }}
          className="absolute top-8 w-6 h-6 text-amber-400 z-20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 19c-2-2-2-5 0-7s2-5 0-7" />
        </motion.svg>
      ))}
    </div>
  );
}

// 4. Boil Animation (Boil / Simmer): Pot with rising steam bubbles
export function BoilAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-sky-500/10 rounded-3xl blur-xl" />

      {/* Stock Pot */}
      <div className="relative w-28 h-20 bg-slate-800 border-2 border-slate-600 rounded-b-2xl shadow-xl z-10 overflow-hidden flex flex-col justify-end p-2">
        {/* Bubbling Water */}
        <div className="w-full h-10 bg-sky-500/20 border-t border-sky-400/50 relative">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [15, -5], opacity: [0.2, 1, 0], scale: [0.5, 1.2] }}
              transition={{ duration: 0.9 + i * 0.2, repeat: Infinity, delay: i * 0.2 }}
              style={{ left: `${15 + i * 22}%` }}
              className="absolute bottom-0 w-3.5 h-3.5 rounded-full border border-sky-300 bg-sky-400/30"
            />
          ))}
        </div>
      </div>

      {/* Rising Steam */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [-5, -30], opacity: [0, 0.6, 0], scale: [0.8, 1.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
          style={{ left: `${30 + i * 20}%` }}
          className="absolute top-6 w-5 h-5 rounded-full bg-white/20 blur-xs z-20"
        />
      ))}
    </div>
  );
}

// 5. Bake Animation (Bake / Oven): Oven chamber with glowing heating coils
export function BakeAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-orange-500/15 rounded-3xl blur-xl" />

      {/* Oven Chamber */}
      <div className="w-32 h-28 bg-slate-950 border-4 border-slate-700 rounded-2xl p-2 flex flex-col justify-between items-center shadow-inner relative">
        {/* Top Glow Heating Element */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-full h-2 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"
        />

        {/* Baking Tray in Oven */}
        <div className="w-24 h-4 bg-amber-800/80 border border-amber-600/60 rounded-md flex items-center justify-around px-2 shadow-md">
          <div className="w-4 h-2 bg-amber-500 rounded-full animate-pulse" />
          <div className="w-4 h-2 bg-amber-500 rounded-full animate-pulse" />
          <div className="w-4 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>

        {/* Bottom Glow Heating Element */}
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-full h-2 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"
        />
      </div>
    </div>
  );
}

// 6. Plate Animation (Plating / Garnish / Serve): Plated dish with sparkling aura
export function PlateAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-amber-400/15 rounded-3xl blur-xl" />

      {/* Plate */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-20 rounded-full border-4 border-slate-300 bg-slate-950 flex items-center justify-center shadow-2xl relative"
      >
        {/* Plated Food */}
        <div className="w-20 h-10 rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 border border-amber-300/60 shadow-lg flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      </motion.div>

      {/* Sparkling Stars */}
      {[...Array(4)].map((_, i) => (
        <motion.span
          key={i}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
          style={{
            top: `${20 + (i % 2 === 0 ? 10 : 60)}%`,
            left: `${20 + i * 20}%`
          }}
          className="absolute text-amber-300 font-bold text-sm z-20"
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

// 7. Default Cooking Animation fallback (Simmering Pot)
export function DefaultCookingAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl" />
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-28 h-20 bg-slate-800 border-2 border-indigo-500/60 rounded-b-2xl shadow-xl flex items-center justify-center text-indigo-300"
      >
        <span className="text-3xl">🍲</span>
      </motion.div>
    </div>
  );
}

/**
 * Keyword matcher mapping step instruction text to closest SVG animation
 */
export function getCookingActionAnimation(instruction = '') {
  const text = instruction.toLowerCase();

  if (text.includes('chop') || text.includes('dice') || text.includes('slice') || text.includes('cut') || text.includes('mince') || text.includes('peel') || text.includes('carve')) {
    return <ChopAnimation />;
  }
  if (text.includes('mix') || text.includes('stir') || text.includes('whisk') || text.includes('combine') || text.includes('toss') || text.includes('fold') || text.includes('blend')) {
    return <StirAnimation />;
  }
  if (text.includes('fry') || text.includes('sear') || text.includes('saute') || text.includes('heat') || text.includes('brown') || text.includes('skillet') || text.includes('pan')) {
    return <HeatAnimation />;
  }
  if (text.includes('boil') || text.includes('simmer') || text.includes('reduce') || text.includes('poach') || text.includes('steam')) {
    return <BoilAnimation />;
  }
  if (text.includes('bake') || text.includes('roast') || text.includes('oven') || text.includes('broil') || text.includes('preheat')) {
    return <BakeAnimation />;
  }
  if (text.includes('plate') || text.includes('garnish') || text.includes('serve') || text.includes('finish') || text.includes('enjoy')) {
    return <PlateAnimation />;
  }

  return <DefaultCookingAnimation />;
}
