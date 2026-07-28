import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Heart, ChefHat } from 'lucide-react';

export default function TopNavbar({
  theme,
  onToggleTheme,
  favoritesCount,
  onOpenFavorites
}) {
  return (
    <div className="w-full bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between z-40 relative">
      {/* Brand Badge */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <ChefHat className="w-5 h-5" />
        </div>
        <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
          Fridge to Recipe
        </span>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Favorites Modal Button */}
        <motion.button
          type="button"
          onClick={onOpenFavorites}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <span className="hidden sm:inline">Favorites</span>
          {favoritesCount > 0 && (
            <span className="bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
              {favoritesCount}
            </span>
          )}
        </motion.button>

        {/* Theme Toggle Button */}
        <motion.button
          type="button"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
