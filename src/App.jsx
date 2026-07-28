import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavbar from './components/TopNavbar.jsx';
import IngredientInput from './components/IngredientInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import FavoritesModal from './components/FavoritesModal.jsx';
import OpeningFridgeScene from './components/animations/OpeningFridgeScene.jsx';
import { validateRecipe } from './utils/validateRecipe.js';

export default function App() {
  const [appState, setAppState] = useState('INPUT'); // 'INPUT' | 'LOADING' | 'ERROR' | 'RECIPE'
  const [recipeData, setRecipeData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Light/Dark Theme state
  const [theme, setTheme] = useState('dark');

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Recent Search History state
  const [recentHistory, setRecentHistory] = useState([]);

  // Active Request tracking
  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const timeoutIdRef = useRef(null);

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Favorite
  const handleToggleFavorite = (recipeToToggle) => {
    const target = recipeToToggle || recipeData;
    if (!target || !target.title) return;

    setFavorites((prev) => {
      const exists = prev.some((r) => r.title === target.title);
      if (exists) {
        return prev.filter((r) => r.title !== target.title);
      }
      return [target, ...prev];
    });
  };

  const handleRemoveFavorite = (title) => {
    setFavorites((prev) => prev.filter((r) => r.title !== title));
  };

  // Generate Recipe handler
  const handleGenerateRecipe = async (ingredientsText, ageGroup = 'Adult', testMode = null) => {
    // Save to Recent Search History
    const newHistoryItem = {
      text: ingredientsText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.text !== ingredientsText.trim())].slice(0, 10));

    const requestId = ++activeRequestIdRef.current;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

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
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsText, ageGroup, testMode }),
        signal: controller.signal
      });

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (activeRequestIdRef.current !== requestId) return;

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (activeRequestIdRef.current !== requestId) return;

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

      validateRecipe(parsedRecipe);
      setRecipeData(parsedRecipe);
      setAppState('RECIPE');
    } catch (err) {
      if (err.name === 'AbortError') return;
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

  const isCurrentRecipeFavorite = recipeData ? favorites.some((r) => r.title === recipeData.title) : false;

  return (
    <div className={`min-h-dvh w-full font-sans transition-colors duration-300 relative ${theme === 'dark' ? 'dark-theme bg-slate-950 text-slate-100' : 'light-theme bg-slate-50 text-slate-900'}`}>
      
      {/* Background Animated Opening & Closing Fridge Scene */}
      <OpeningFridgeScene />

      {/* Universal Top Navbar Toolbar */}
      <TopNavbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectRecipe={(recipe) => {
          setRecipeData(recipe);
          setAppState('RECIPE');
        }}
        onRemoveFavorite={handleRemoveFavorite}
      />

      {/* Main View Flow */}
      <AnimatePresence mode="wait">
        {appState === 'INPUT' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full relative z-10"
          >
            <IngredientInput
              onSubmit={handleGenerateRecipe}
              isLoading={false}
              recentHistory={recentHistory}
              onSelectHistory={(text) => handleGenerateRecipe(text)}
            />
          </motion.div>
        )}

        {appState === 'LOADING' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-dvh w-full relative z-10"
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
            className="min-h-dvh w-full relative z-10"
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
            className="min-h-dvh w-full relative z-10"
          >
            <RecipeCard
              recipe={recipeData}
              onReset={handleReset}
              isFavorite={isCurrentRecipeFavorite}
              onToggleFavorite={() => handleToggleFavorite(recipeData)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
