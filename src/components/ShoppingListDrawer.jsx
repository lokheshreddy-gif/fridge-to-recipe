import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Check, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function ShoppingListDrawer({
  isOpen,
  onClose,
  shoppingList = [],
  onToggleItem,
  onAddItem,
  onClearCompleted
}) {
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  const uncheckedCount = shoppingList.filter((item) => !item.checked).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md h-full glass-panel border-l border-slate-200 dark:border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl relative bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Shopping List
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {uncheckedCount} items left to buy
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleAdd} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add missing ingredient..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:border-indigo-500 font-semibold"
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-500 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add
            </button>
          </form>

          {/* Shopping Checklist */}
          <div className="flex-1 overflow-y-auto py-4 space-y-2">
            {shoppingList.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <CheckSquare className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your shopping list is empty.</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click "Add missing items to list" on any recipe ingredient card to populate this list!
                </p>
              </div>
            ) : (
              shoppingList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleItem(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    item.checked
                      ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'glass-card border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        item.checked
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs font-extrabold break-words ${
                        item.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {item.ingredient}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Clear Completed Action */}
          {shoppingList.some((i) => i.checked) && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClearCompleted}
                className="w-full py-2.5 rounded-xl bg-rose-50 dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-slate-800 hover:bg-rose-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Completed Items
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
