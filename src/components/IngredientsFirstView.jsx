import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Sparkles, Utensils, Clock, Layers, Flame, Heart, Activity, Info, MapPin, Recycle, Leaf, ShieldCheck } from 'lucide-react';
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
            
            {recipe.isLeftoverRecipe ? (
              <>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Recycle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
                  100% Leftover Recipe
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Leaf className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  🌱 Zero Waste ({recipe.sustainabilityScore || '98% Reduction'})
                </span>
              </>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Step 1: Ingredients Needed
              </span>
            )}

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

          {recipe.ageNote && (
            <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{recipe.ageNote}</span>
            </div>
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
          </div>
        )}

        {/* Servings Control */}
        <ServingsControl
          servings={servings}
          onServingsChange={setServings}
          baseServings={recipe.baseServings || 2}
        />

        {/* Ingredients Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-indigo-500" />
              Ingredients Needed:
            </h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {recipe.ingredients?.length || 0} Items Total
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recipe.ingredients?.map((ing, idx) => (
              <motion.div
                key={ing.id || idx}
                variants={cardVariants}
                className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md flex items-center gap-4 hover:border-indigo-400/50 transition-all bg-white dark:bg-slate-900"
              >
                <div className="relative shrink-0">
                  <IngredientImage
                    icon={ing.icon || 'vegetable'}
                    altName={ing.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-700"
                  />
                  {ing.commonlyAvailable && (
                    <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-700 shadow-sm flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                      {ing.commonlyAvailable}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {ing.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                      {formatAmount(ing.amount)}
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {ing.unit}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Start Step-by-Step Cooking Action Button */}
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={() => onStartCooking(servings)}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-lg shadow-2xl hover:shadow-indigo-500/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-3 mx-auto"
          >
            <ChefHat className="w-6 h-6 animate-bounce" />
            <span>Start Step-by-Step Cooking Mode</span>
          </button>
        </div>

      </main>
    </div>
  );
}
