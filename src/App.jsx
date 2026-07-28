import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IngredientInput from './components/IngredientInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import { validateRecipe } from './utils/validateRecipe.js';

export default function App() {
  const [appState, setAppState] = useState('INPUT'); // 'INPUT' | 'LOADING' | 'ERROR' | 'RECIPE'
  const [recipeData, setRecipeData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Track active request ID and AbortController to discard stale responses
  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const handleGenerateRecipe = async (ingredientsText, testMode = null) => {
    // 1. Increment request ID and cancel any in-flight request
    const requestId = ++activeRequestIdRef.current;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // 2. Set up new AbortController and 20s timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setAppState('LOADING');
    setErrorMessage('');

    timeoutIdRef.current = setTimeout(() => {
      if (activeRequestIdRef.current === requestId) {
        controller.abort();
        setErrorMessage('Request timed out. The AI chef took longer than 20 seconds to respond. Please try again.');
        setAppState('ERROR');
      }
    }, 20000);

    try {
      // 3. Perform fetch call to backend /api/generate
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsText, testMode }),
        signal: controller.signal
      });

      // Clear timeout upon network response
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

      // Check for stale response
      if (activeRequestIdRef.current !== requestId) return;

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server returned status ${response.status}`);
      }

      const resData = await response.json();

      if (activeRequestIdRef.current !== requestId) return;

      // 4. Try/catch around JSON parsing & raw text handling
      let parsedRecipe = null;
      if (resData.rawText) {
        try {
          parsedRecipe = JSON.parse(resData.rawText);
        } catch (jsonErr) {
          console.error('[JSON Parse Failure]', jsonErr, resData.rawText);
          throw new Error("Couldn't understand that recipe. The AI response was malformed.");
        }
      } else if (resData.title && resData.ingredients) {
        parsedRecipe = resData;
      } else {
        throw new Error("Couldn't understand that recipe format from server.");
      }

      // 5. Strict schema validation check via validateRecipe()
      validateRecipe(parsedRecipe);

      // 6. Set validated recipe data & transition to RECIPE state
      setRecipeData(parsedRecipe);
      setAppState('RECIPE');
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[Request Aborted]');
        return; // Ignore aborted requests silently
      }

      if (activeRequestIdRef.current !== requestId) return;

      console.error('[App Error]', err);
      setErrorMessage(err.message || 'Failed to generate recipe. Please check your connection and try again.');
      setAppState('ERROR');
    }
  };

  const handleCancelRequest = () => {
    activeRequestIdRef.current++;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    setAppState('INPUT');
  };

  const handleReset = () => {
    setAppState('INPUT');
    setRecipeData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-dvh w-full bg-slate-950 text-slate-100 relative font-sans overflow-y-auto">
      <AnimatePresence mode="wait">
        {appState === 'INPUT' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full"
          >
            <IngredientInput onSubmit={handleGenerateRecipe} isLoading={false} />
          </motion.div>
        )}

        {appState === 'LOADING' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full"
          >
            <LoadingState onCancel={handleCancelRequest} />
          </motion.div>
        )}

        {appState === 'ERROR' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full"
          >
            <ErrorState error={errorMessage} onRetry={handleReset} />
          </motion.div>
        )}

        {appState === 'RECIPE' && recipeData && (
          <motion.div
            key="recipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full"
          >
            <RecipeCard recipe={recipeData} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
