import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Sparkles, Utensils, Clock, Layers, Flame, Heart, Activity, Info, MapPin } from 'lucide-react';
import ServingsControl from './ServingsControl.jsx';
import IngredientImage from './IngredientImage.jsx';
import OpeningFridgeScene from './animations/OpeningFridgeScene.jsx';

export default function IngredientsFirstView({
  recipe,
  onStartCooking,
  onReset,
  isFavorite = false,
  onToggleFavorite
}) {
  const [servings, setServings] = useState(recipe.baseServings || 2);

  const formatAmount = (baseAmount) => {
    if (!baseAmount || isNaN(baseAmount)) return '';
    const scaled = (baseAmount * servings) / (recipe.baseServings || 2);
    
    const whole = Math.floor(scaled);
    const remainder = scaled - whole;
    
    if (Math.abs(remainder - 0.5) < 0.05) return whole > 0 ? `${whole} ½` : '½';
    if (Math.abs(remainder - 0.25) < 0.05) return whole > 0 ? `${whole} ¼` : '¼';
    if (Math.abs(remainder - 0.75) < 0.05) return whole > 0 ? `${whole} ¾` : '¾';
    if (Math.abs(remainder - 0.33) < 0.05) return whole > 0 ? `${whole} ⅓` : '⅓';
    
    return Number(scaled.toFixed(scaled % 1 === 0 ? 0 : 2));
  };

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Staggered Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 relative">
      
      {/* Animated "Opening the Fridge" Background Scene */}
      <OpeningFridgeScene />

      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose Another Recipe
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save Favorite'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-full">
            <ChefHat className="w-4 h-4" />
            Step 1: Get Ingredients Ready
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Title Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center sm:text-left bg-white dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1: Ingredients Needed
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              Time Needed: {totalTime} mins
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed font-semibold">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Nutrition Card */}
        {recipe.nutrition && (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/60 shadow-xl space-y-4 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Nutrition Info (per plate)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Estimated</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 text-center shadow-md">
                <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">Energy</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                  {recipe.nutrition.caloriesPerServing} kcal
                </span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 text-center shadow-md">
                <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">Protein</span>
                <span className="text-xl font-black text-indigo-400 mt-0.5 block">
                  {recipe.nutrition.proteinGrams}g
                </span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 text-center shadow-md">
                <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">Carbs</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">
                  {recipe.nutrition.carbsGrams}g
                </span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl border border-slate-800 text-center shadow-md">
                <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block">Fat</span>
                <span className="text-xl font-black text-rose-400 mt-0.5 block">
                  {recipe.nutrition.fatGrams}g
                </span>
              </div>
            </div>

            {recipe.ageNote && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-bold">
                💡 <strong>Age Note:</strong> {recipe.ageNote}
              </div>
            )}

            {/* Nutrition Disclaimer */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Nutrition values are simple estimates. Consult a doctor for special medical diets.
              </span>
            </div>
          </div>
        )}

        {/* Servings Stepper */}
        <ServingsControl
          servings={servings}
          baseServings={recipe.baseServings || 2}
          onServingsChange={setServings}
        />

        {/* Staggered Ingredients Grid */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Your Ingredients ({recipe.ingredients.length} items)
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recipe.ingredients.map((ing, idx) => (
              <motion.div
                key={ing.id || idx}
                variants={cardVariants}
                className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 shadow-md hover:border-indigo-400 transition-all duration-200 group bg-white dark:bg-slate-900"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <IngredientImage iconKeyword={ing.icon} name={ing.name} className="w-12 h-12" />

                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug break-words block">
                      {ing.name}
                    </span>

                    {/* Commonly Found at Home Location Tag */}
                    {ing.commonlyAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 mt-1">
                        <MapPin className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        {ing.commonlyAvailable}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-black text-xs sm:text-sm shrink-0">
                  {formatAmount(ing.amount)} {ing.unit}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Start Cooking Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <motion.button
            type="button"
            onClick={() => onStartCooking(servings)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-base sm:text-lg shadow-2xl shadow-indigo-500/30 cursor-pointer flex items-center justify-center gap-3"
          >
            <Flame className="w-6 h-6 animate-pulse" />
            Start Cooking ({recipe.steps.length} Easy Steps)
            <Utensils className="w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
