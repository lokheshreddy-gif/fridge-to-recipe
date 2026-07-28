import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle2, RotateCcw, Flame, Sparkles, Award } from 'lucide-react';
import CookingScene from './CookingScene.jsx';

export default function CookingSequence({ recipe, servings, onBackToIngredients }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const steps = recipe.steps || [];
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFinished = currentStepIndex >= totalSteps;

  // Initialize timer for steps with durationMinutes
  useEffect(() => {
    if (currentStep && currentStep.durationMinutes) {
      setTimerSeconds(currentStep.durationMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Timer Countdown logic
  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalDuration = currentStep?.durationMinutes ? currentStep.durationMinutes * 60 : 1;
  const timerPercentage = totalDuration > 0 ? Math.round(((totalDuration - timerSeconds) / totalDuration) * 100) : 0;

  return (
    <div className="min-h-dvh w-full flex flex-col bg-slate-950 text-slate-100 pb-16">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToIngredients}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Review Ingredients
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-indigo-400" />
          Phase 2: Animated "Making Of" Sequence
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        
        {/* Step Progress Top Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>
              {isFinished ? 'Recipe Complete!' : `Step ${currentStepIndex + 1} of ${totalSteps}`}
            </span>
            <span>
              {isFinished ? '100%' : `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: isFinished
                  ? '100%'
                  : `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%`
              }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Step Display Card */}
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl space-y-6 my-auto text-center flex flex-col items-center"
            >
              {/* Rich Data-Driven Animated Cooking Scene */}
              <CookingScene
                step={currentStep}
                allIngredients={recipe.ingredients || []}
              />

              {/* Step Title & Instruction */}
              <div className="max-w-2xl space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Step Instruction {currentStepIndex + 1}
                </span>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
                  {currentStep.instruction}
                </h2>
              </div>

              {/* Step Timer Ring (If durationMinutes present) */}
              {currentStep.durationMinutes && (
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 w-full max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="4" fill="none" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-indigo-400 transition-all duration-300"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (125.6 * timerPercentage) / 100}
                        />
                      </svg>
                      <Clock className="w-5 h-5 text-indigo-400 absolute" />
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-slate-400 font-semibold block">Timer</span>
                      <span className="text-lg font-extrabold text-white font-mono">
                        {formatTimer(timerSeconds)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isTimerRunning
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-600 text-white shadow-md'
                    }`}
                  >
                    {isTimerRunning ? 'Pause' : 'Start Timer'}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Finished Celebration Screen */
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-700/60 shadow-2xl text-center space-y-6 my-auto flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <Award className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2 max-w-lg">
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Success! Recipe Finished
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Bon Appétit! {recipe.title} is Ready!
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  All {totalSteps} cooking steps have been completed for {servings} servings. Serve hot and enjoy your creation!
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(0)}
                  className="px-6 py-3 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all font-bold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Replay Sequence
                </button>

                <button
                  type="button"
                  onClick={onBackToIngredients}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg cursor-pointer"
                >
                  Back to Ingredients
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User-Controlled Navigation Buttons */}
        {!isFinished && (
          <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`px-5 py-3 rounded-2xl border font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                currentStepIndex === 0
                  ? 'border-slate-800 text-slate-600 bg-slate-900/40 cursor-not-allowed'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </button>

            <motion.button
              type="button"
              onClick={handleNextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
            >
              {isLastStep ? 'Finish Cooking 🎉' : 'Next Step'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
}
