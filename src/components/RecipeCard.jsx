import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IngredientsFirstView from './IngredientsFirstView.jsx';
import CookingSequence from './CookingSequence.jsx';

export default function RecipeCard({ recipe, onReset }) {
  const [phase, setPhase] = useState('INGREDIENTS'); // 'INGREDIENTS' (Phase 1) | 'COOKING_SEQUENCE' (Phase 2)
  const [selectedServings, setSelectedServings] = useState(recipe.baseServings || 2);

  const handleStartCooking = (servings) => {
    setSelectedServings(servings);
    setPhase('COOKING_SEQUENCE');
  };

  const handleBackToIngredients = () => {
    setPhase('INGREDIENTS');
  };

  return (
    <div className="min-h-dvh w-full bg-slate-950 text-slate-100 overflow-y-auto">
      <AnimatePresence mode="wait">
        {phase === 'INGREDIENTS' ? (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-dvh w-full"
          >
            <IngredientsFirstView
              recipe={recipe}
              onStartCooking={handleStartCooking}
              onReset={onReset}
            />
          </motion.div>
        ) : (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-dvh w-full"
          >
            <CookingSequence
              recipe={recipe}
              servings={selectedServings}
              onBackToIngredients={handleBackToIngredients}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
