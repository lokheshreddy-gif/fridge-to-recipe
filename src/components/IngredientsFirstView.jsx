import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Sparkles, Utensils, Clock, Layers, Flame } from 'lucide-react';
import ServingsControl from './ServingsControl.jsx';
import IngredientImage from './IngredientImage.jsx';

export default function IngredientsFirstView({ recipe, onStartCooking, onReset }) {
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
    <div className="min-h-dvh w-full flex flex-col bg-slate-950 text-slate-100 pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Cook Something Else
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          <ChefHat className="w-4 h-4" />
          Phase 1: Ingredient Prep
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        
        {/* Title Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 2: Required Products
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Total Time: {totalTime} mins
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Servings Stepper */}
        <ServingsControl
          servings={servings}
          baseServings={recipe.baseServings || 2}
          onServingsChange={setServings}
        />

        {/* Staggered Ingredients Grid (Counter Layout) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Kitchen Counter ({recipe.ingredients.length} Items Laid Out)
            </h2>
            <span className="text-xs text-slate-400">Review amounts before cooking</span>
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
                className="glass-card rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between gap-3 shadow-lg hover:border-slate-500 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Real Photographic Ingredient Thumbnail with Animated SVG Fallback */}
                  <IngredientImage iconKeyword={ing.icon} name={ing.name} className="w-12 h-12" />

                  {/* Wrapped, un-truncated full ingredient name */}
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-100 leading-snug break-words block">
                      {ing.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                      Item #{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs sm:text-sm shrink-0">
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
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-base sm:text-lg shadow-2xl shadow-indigo-500/30 cursor-pointer flex items-center justify-center gap-3"
          >
            <Flame className="w-6 h-6 animate-pulse" />
            Start Cooking ({recipe.steps.length} Steps)
            <Utensils className="w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
