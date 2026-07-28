import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Heart, ShoppingBag, History, Sparkles, ChefHat } from 'lucide-react';

export default function TopNavbar({
  theme,
  onToggleTheme,
  favoritesCount,
  onOpenFavorites,
  shoppingListCount,
  onOpenShoppingList
}) {
  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between z-40 relative">
      {/* Brand Badge */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <ChefHat className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
          Fridge to Recipe
        </span>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Shopping List Drawer Button */}
        <motion.button
          type="button"
          onClick={onOpenShoppingList}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">My List</span>
          {shoppingListCount > 0 && (
            <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
              {shoppingListCount}
            </span>
          )}
        </motion.button>

        {/* Favorites Modal Button */}
        <motion.button
          type="button"
          onClick={onOpenFavorites}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />
          <span className="hidden sm:inline">Favorites</span>
          {favoritesCount > 0 && (
            <span className="bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
              {favoritesCount}
            </span>
          )}
        </motion.button>

        {/* Theme Toggle Button (Sun/Moon) */}
        <motion.button
          type="button"
          onClick={onToggleTheme}
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400 transition-all cursor-pointer shadow-md"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </motion.button>
      </div>
    </div>
  );
}
