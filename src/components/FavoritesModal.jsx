import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Utensils, Clock, Trash2 } from 'lucide-react';

export default function FavoritesModal({ isOpen, onClose, favorites, onSelectRecipe, onRemoveFavorite }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl glass-panel rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700/80 relative flex flex-col max-h-[85vh] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Saved Favorite Recipes ({favorites.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No favorited recipes saved yet.</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs mx-auto">
                  Click the heart icon on any generated recipe card to bookmark it for quick access!
                </p>
              </div>
            ) : (
              favorites.map((recipe, idx) => (
                <div
                  key={recipe.id || idx}
                  className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-indigo-500/50 transition-all group bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <div
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {(recipe.prepTimeMinutes || 10) + (recipe.cookTimeMinutes || 15)} mins
                      </span>
                      <span>•</span>
                      <span>{recipe.ingredients?.length || 0} Ingredients</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRecipe(recipe);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      Cook
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(recipe.title)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-slate-900/80 text-rose-500 dark:text-rose-400 hover:text-rose-600 border border-rose-200 dark:border-slate-800 transition-all cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
