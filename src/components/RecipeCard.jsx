import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Utensils, ChefHat, Sparkles, Film } from 'lucide-react';
import ServingsControl from './ServingsControl.jsx';
import IngredientList from './IngredientList.jsx';
import StepList from './StepList.jsx';
import AnimatedDishVideo from './AnimatedDishVideo.jsx';

export default function RecipeCard({ recipe, onReset }) {
  const [servings, setServings] = useState(recipe.baseServings || 2);
  const [checkedSteps, setCheckedSteps] = useState({});

  const toggleStep = (stepId) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Staggered Animation Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col bg-slate-950 text-slate-100 pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
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
          Fridge to Recipe Studio
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8"
        >
          {/* Section 1: Recipe Title & Metadata Header */}
          <motion.div variants={itemVariants} className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Custom AI Recipe
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Total: {totalTime} mins
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight leading-tight">
              {recipe.title}
            </h1>
            
            {recipe.description && (
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-3xl font-medium">
                {recipe.description}
              </p>
            )}

            {/* Time Metrics Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Prep Time</span>
                <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">
                  {recipe.prepTimeMinutes} mins
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Cook Time</span>
                <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">
                  {recipe.cookTimeMinutes} mins
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Base Yield</span>
                <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">
                  {recipe.baseServings} servings
                </span>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Servings Stepper */}
          <motion.div variants={itemVariants}>
            <ServingsControl
              servings={servings}
              baseServings={recipe.baseServings}
              onServingsChange={setServings}
            />
          </motion.div>

          {/* Section 3: Animated Reference Cooking Video Component */}
          <motion.div variants={itemVariants}>
            <AnimatedDishVideo recipe={recipe} />
          </motion.div>

          {/* Section 4 & 5: Two-column Desktop Layout (Ingredients Left, Steps Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left Column: Scalable Ingredients & Swaps */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-700/60">
                <IngredientList
                  ingredients={recipe.ingredients}
                  baseServings={recipe.baseServings}
                  currentServings={servings}
                  swaps={recipe.swaps}
                />
              </div>
            </motion.div>

            {/* Right Column: Checkable Steps & Progress Bar */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
              <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-700/60">
                <StepList
                  steps={recipe.steps}
                  checkedSteps={checkedSteps}
                  onToggleStep={toggleStep}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
