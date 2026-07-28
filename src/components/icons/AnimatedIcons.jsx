import React from 'react';
import { motion } from 'framer-motion';

// 1. Salt Icon: Shaker with animated sprinkle dot particles
export function SaltIcon() {
  return (
    <motion.svg
      whileHover={{ rotate: [-5, 5, -5, 0], y: -2 }}
      transition={{ duration: 0.4 }}
      className="w-6 h-6 text-slate-200"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="8" width="10" height="12" rx="2" className="stroke-indigo-400" fill="rgba(99, 102, 241, 0.1)" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" className="stroke-slate-300" />
      <motion.circle
        animate={{ y: [0, 3, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        cx="10" cy="13" r="0.75" fill="#E2E8F0"
      />
      <motion.circle
        animate={{ y: [0, 3, 0], opacity: [0.8, 0.3, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        cx="14" cy="15" r="0.75" fill="#E2E8F0"
      />
      <motion.circle
        animate={{ y: [0, 3, 0], opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: 0.6 }}
        cx="12" cy="17" r="0.75" fill="#E2E8F0"
      />
    </motion.svg>
  );
}

// 2. Garlic Icon: Clove with rotation wobble
export function GarlicIcon() {
  return (
    <motion.svg
      whileHover={{ rotate: [0, -12, 12, 0] }}
      transition={{ duration: 0.5 }}
      className="w-6 h-6 text-amber-200"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M12 3c-1.5 2-4 4.5-4 8a6 6 0 1 0 12 0c0-3.5-2.5-6-4-8z"
        className="stroke-amber-300"
        fill="rgba(252, 211, 77, 0.15)"
      />
      <path d="M12 3v17" className="stroke-amber-400/60" />
      <path d="M8.5 11c1.5 2 1.5 4 0 6" className="stroke-amber-400/40" />
      <path d="M15.5 11c-1.5 2-1.5 4 0 6" className="stroke-amber-400/40" />
    </motion.svg>
  );
}

// 3. Lemon Icon: Citrus slice with gentle squeeze / bounce
export function LemonIcon() {
  return (
    <motion.svg
      whileHover={{ scale: [1, 0.9, 1.1, 1], rotate: 15 }}
      transition={{ duration: 0.5 }}
      className="w-6 h-6 text-yellow-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" className="stroke-yellow-400" fill="rgba(250, 204, 21, 0.15)" />
      <path d="M12 3v18" className="stroke-yellow-300/60" />
      <path d="M3 12h18" className="stroke-yellow-300/60" />
      <path d="m5.6 5.6 12.8 12.8" className="stroke-yellow-300/40" />
      <path d="m18.4 5.6-12.8 12.8" className="stroke-yellow-300/40" />
    </motion.svg>
  );
}

// 4. Oil Icon: Bottle with animated falling droplet
export function OilIcon() {
  return (
    <motion.svg
      whileHover={{ y: -2 }}
      className="w-6 h-6 text-emerald-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2h4v3h-4z" className="stroke-emerald-300" />
      <path d="M8 8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z" className="stroke-emerald-400" fill="rgba(52, 211, 153, 0.15)" />
      <motion.path
        animate={{ y: [0, 4, 0], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        d="M12 11a1.5 1.5 0 0 1 1.5 1.5c0 1-.8 1.5-1.5 2.5-.7-1-1.5-1.5-1.5-2.5A1.5 1.5 0 0 1 12 11Z"
        fill="#34D399"
        className="stroke-none"
      />
    </motion.svg>
  );
}

// 5. Meat Icon: Steak/chicken cut with pulse/scale
export function MeatIcon() {
  return (
    <motion.svg
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.3 }}
      className="w-6 h-6 text-rose-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19.5 4.5c-2-2-5.5-1.5-8 1L4.5 12.5c-2.5 2.5-3 6-1 8s5.5 1.5 8-1l7-7c2.5-2.5 3-6 1-8Z" className="stroke-rose-400" fill="rgba(251, 113, 133, 0.15)" />
      <path d="m14 8 2 2" className="stroke-rose-300" />
      <path d="m11 11 2 2" className="stroke-rose-300" />
      <path d="m8 14 2 2" className="stroke-rose-300" />
    </motion.svg>
  );
}

// 6. Vegetable Icon: Leaf sway micro-animation
export function VegetableIcon() {
  return (
    <motion.svg
      whileHover={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 0.6 }}
      className="w-6 h-6 text-green-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A9 9 0 0 0 20 11V3h-8a9 9 0 0 0-9 9v8h8Z" className="stroke-green-400" fill="rgba(74, 222, 128, 0.15)" />
      <path d="M11 20V11" className="stroke-green-300" />
      <path d="M12 11c3 0 6-2 7-5" className="stroke-green-300/60" />
    </motion.svg>
  );
}

// 7. Default Neutral Chef Hat Icon fallback (Guaranteed fallback)
export function DefaultIcon() {
  return (
    <motion.svg
      whileHover={{ scale: 1.1, y: -2 }}
      transition={{ duration: 0.3 }}
      className="w-6 h-6 text-indigo-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 13.8a4.5 4.5 0 1 1 2.6-8.3 4.5 4.5 0 0 1 6.8 0 4.5 4.5 0 1 1 2.6 8.3" className="stroke-indigo-400" fill="rgba(129, 140, 248, 0.15)" />
      <path d="M6 17h12v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3Z" className="stroke-indigo-300" />
      <path d="M6 14h12" className="stroke-indigo-300" />
    </motion.svg>
  );
}

/**
 * Robust, case-insensitive keyword matcher function with expanded category coverage.
 * Always returns a valid SVG component — NEVER null or undefined.
 * Logs console.warn when falling through to DefaultIcon.
 */
export function getIngredientIcon(iconKeyword = '', ingredientName = '') {
  const key = `${iconKeyword} ${ingredientName}`.toLowerCase();

  // Spices & Seasonings
  if (/\b(salt|pepper|spice|seasoning|chili|flak|sugar|cinnamon|paprika|cumin|curry)\b/.test(key)) {
    return <SaltIcon />;
  }

  // Garlic & Onions
  if (/\b(garlic|onion|shallot|scallion|leek)\b/.test(key)) {
    return <GarlicIcon />;
  }

  // Citrus & Acids
  if (/\b(lemon|lime|citrus|orange|acid|vinegar)\b/.test(key)) {
    return <LemonIcon />;
  }

  // Oils, Fats & Liquids
  if (/\b(oil|butter|fat|sauce|soy|sesame|dressing|cream)\b/.test(key)) {
    return <OilIcon />;
  }

  // Proteins & Meats
  if (/\b(chicken|beef|pork|meat|turkey|steak|fish|salmon|tofu|egg|bacon|ham|shrimp|seafood|protein)\b/.test(key)) {
    return <MeatIcon />;
  }

  // Vegetables, Greens & Herbs
  if (/\b(spinach|vegetable|veggie|herb|kale|tomato|pepper|bell pepper|green|parsley|basil|chive|broccoli|onion|carrot|mushroom|zucchini|cucumber|celery|corn|pea|lettuce)\b/.test(key)) {
    return <VegetableIcon />;
  }

  // Dairy & Grains fallback mapping to nearest existing icon
  if (/\b(cheese|cheddar|feta|mozzarella|parmesan|milk|yogurt)\b/.test(key)) {
    return <OilIcon />;
  }
  if (/\b(pasta|spaghetti|rice|noodle|bread|grain|flour|oat)\b/.test(key)) {
    return <SaltIcon />;
  }

  // Fallback to DefaultIcon and log console.warn for transparency
  console.warn(`[AnimatedIcons] No specific icon match for keyword: "${iconKeyword}" (Name: "${ingredientName}"), using DefaultIcon fallback.`);
  return <DefaultIcon />;
}
