import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, AlertCircle, RefreshCw, AlertTriangle, History, Flame, Users2, ArrowRight, Mic, MicOff, Camera, ImagePlus, CheckCircle2, Video, Sliders, Edit3, Check, Recycle, Plus, Trash2, Clock } from 'lucide-react';
import LiveCameraModal from './LiveCameraModal.jsx';
import { extractImageFeatures } from '../utils/extractImageFeatures.js';

const AGE_CATEGORIES = [
  {
    id: 'Toddler',
    label: 'Babies & Toddlers (Ages 1–3)',
    shortLabel: 'Ages 1–3 (Baby)',
    dishes: [
      { name: '🍲 Moong Dal Khichdi', query: 'Moong Dal Khichdi' },
      { name: '🍎 Apple Ragi Porridge', query: 'Apple Ragi Porridge' },
      { name: '🌾 Suji Upma', query: 'Suji Upma' },
      { name: '🍚 Mashed Curd Rice', query: 'Mashed Curd Rice' }
    ]
  },
  {
    id: 'Kid',
    label: 'Kids (Ages 4–12)',
    shortLabel: 'Ages 4–12 (Kids)',
    dishes: [
      { name: '⚪ Mini Idlis', query: 'Mini Idlis' },
      { name: '🧀 Cheese Whole Wheat Dosa', query: 'Cheese Whole Wheat Dosa' },
      { name: '🍚 Vegetable Pulao', query: 'Vegetable Pulao' },
      { name: '🧀 Paneer Bhurji', query: 'Paneer Bhurji' }
    ]
  },
  {
    id: 'Teen',
    label: 'Teens & Students (Ages 13–25)',
    shortLabel: 'Ages 13–25 (Teens)',
    dishes: [
      { name: '🥘 Paneer Butter Masala', query: 'Paneer Butter Masala' },
      { name: '🫓 Aloo Paratha', query: 'Aloo Paratha' },
      { name: '🍗 Chicken Tikka Masala', query: 'Chicken Tikka Masala' }
    ]
  },
  {
    id: 'Adult',
    label: 'Adults (Ages 26–50)',
    shortLabel: 'Ages 26–50 (Adult)',
    dishes: [
      { name: '🥘 Chana Masala', query: 'Chana Masala' },
      { name: '🥬 Palak Paneer', query: 'Palak Paneer' },
      { name: '🍚 Vegetable Biryani', query: 'Vegetable Biryani' }
    ]
  },
  {
    id: 'Senior',
    label: 'Seniors (Ages 51+)',
    shortLabel: 'Ages 51+ (Senior)',
    dishes: [
      { name: '🌾 Oats Upma', query: 'Oats Upma' },
      { name: '🥣 Dalia Khichdi', query: 'Dalia Khichdi' },
      { name: '🍲 Toor Dal Fry', query: 'Toor Dal Fry' }
    ]
  }
];

const QUICK_LEFTOVER_SUGGESTIONS = [
  { name: 'Cooked Rice', icon: '🍚', defaultQty: '2 cups', freshness: 'Fresh Today' },
  { name: 'Leftover Chicken', icon: '🍗', defaultQty: '300g', freshness: 'Use Soon (1-2 days)' },
  { name: 'Cooked Vegetables', icon: '🥦', defaultQty: '1 bowl', freshness: 'Fresh Today' },
  { name: 'Leftover Naan/Roti', icon: '🫓', defaultQty: '3 pieces', freshness: 'Use Soon (1-2 days)' },
  { name: 'Cooked Beans/Dal', icon: '🫘', defaultQty: '1 cup', freshness: 'Fresh Today' },
  { name: 'Leftover Pasta', icon: '🍝', defaultQty: '1.5 cups', freshness: 'Use Soon (1-2 days)' },
  { name: 'Boiled Potatoes', icon: '🥔', defaultQty: '4 items', freshness: 'Fresh Today' },
  { name: 'Leftover Curry', icon: '🍳', defaultQty: '1 bowl', freshness: 'Use Soon (1-2 days)' }
];

const HERO_DISH_CARDS = [
  {
    id: 'pulao',
    title: 'Veg Pulao & Rice',
    desc: 'Rice, green peas, carrots, ghee and simple spices',
    badge: 'Popular',
    query: 'Vegetable Pulao',
    photo: '/ingredient-images/vegetable.png',
    cardBg: 'bg-amber-50 dark:bg-slate-900 border-amber-200 dark:border-amber-500/40',
    badgeBg: 'bg-amber-600 text-white'
  },
  {
    id: 'paneer_butter',
    title: 'Paneer Butter Masala',
    desc: 'Soft paneer in smooth tomato sauce',
    badge: 'Tasty',
    query: 'Paneer Butter Masala',
    photo: '/ingredient-images/garlic.png',
    cardBg: 'bg-rose-50 dark:bg-slate-900 border-rose-200 dark:border-rose-500/40',
    badgeBg: 'bg-rose-600 text-white'
  },
  {
    id: 'khichdi',
    title: 'Moong Dal Khichdi',
    desc: 'Soft yellow dal and rice with ghee',
    badge: 'Light Food',
    query: 'Moong Dal Khichdi',
    photo: '/ingredient-images/salt.png',
    cardBg: 'bg-yellow-50 dark:bg-slate-900 border-yellow-200 dark:border-yellow-500/40',
    badgeBg: 'bg-yellow-600 text-white'
  }
];

export default function IngredientInput({ onSubmit, isLoading, recentHistory = [], onSelectHistory }) {
  // Main Input Mode: 'fresh' | 'leftovers'
  const [inputMode, setInputMode] = useState('fresh');

  // Fresh Ingredients State
  const [freshText, setFreshText] = useState('');

  // Leftover Food State
  const [leftoversList, setLeftoversList] = useState([
    { id: '1', name: 'Cooked Rice', quantity: '2 cups', freshness: 'Fresh Today' },
    { id: '2', name: 'Leftover Chicken', quantity: '300g', freshness: 'Use Soon (1-2 days)' }
  ]);
  const [customLeftoverName, setCustomLeftoverName] = useState('');
  const [customLeftoverQty, setCustomLeftoverQty] = useState('1 portion');

  const [selectedAge, setSelectedAge] = useState('Adult');
  const [errorMsg, setErrorMsg] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Live Camera Scanner State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState('');
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Toggle input mode without clearing previous inputs
  const handleSwitchMode = (mode) => {
    setInputMode(mode);
    setErrorMsg('');
  };

  // Add Leftover item
  const handleAddLeftoverItem = (name, quantity = '1 portion', freshness = 'Fresh Today') => {
    if (!name.trim()) return;
    if (leftoversList.length >= 10) {
      setErrorMsg('Maximum 10 leftover items allowed per recipe session.');
      return;
    }
    const exists = leftoversList.some((item) => item.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      setErrorMsg(`"${name}" is already in your leftovers list.`);
      return;
    }
    setLeftoversList((prev) => [
      ...prev,
      { id: `leftover-${Date.now()}-${Math.random()}`, name: name.trim(), quantity, freshness }
    ]);
    setCustomLeftoverName('');
    setErrorMsg('');
  };

  const handleRemoveLeftoverItem = (id) => {
    setLeftoversList((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMode === 'leftovers') {
      if (leftoversList.length === 0) {
        setErrorMsg('Please add at least one leftover food item to generate a zero-waste recipe.');
        return;
      }
      const leftoverPayload = leftoversList.map((item) => `${item.name} (${item.quantity})`).join(', ');
      onSubmit(leftoverPayload, selectedAge, null, true);
    } else {
      if (!freshText.trim()) {
        setErrorMsg('Please type your available ingredients or select a dish.');
        return;
      }
      onSubmit(freshText.trim(), selectedAge, null, false);
    }
  };

  // Voice Input Speech Recognition
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMsg('Voice recognition is not supported in your browser. Please type or use photo scan.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (inputMode === 'leftovers') {
          handleAddLeftoverItem(transcript, '1 portion');
        } else {
          setFreshText((prev) => (prev ? `${prev}, ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setErrorMsg('Could not hear clearly. Please try speaking again or type your ingredients.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Food Photo Upload & High-Accuracy Color-Correlated Feature Classification
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningPhoto(true);
    setScanStatusMessage('Scanning food photo features...');

    try {
      const colorProfile = await extractImageFeatures(file);
      setScanStatusMessage(`Analyzing ${colorProfile.dominantHue} tone features...`);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          const res = await fetch('/api/scan-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              filename: file.name,
              colorProfile
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.detectedDish) {
              if (inputMode === 'leftovers') {
                handleAddLeftoverItem(data.detectedDish, '1 portion');
              } else {
                setFreshText(data.detectedDish);
              }
              setScanStatusMessage(`✨ AI Scan Identified: ${data.detectedDish}`);
            }
          }
        } catch (err) {
          console.error('[Scan Error]', err);
        } finally {
          setIsScanningPhoto(false);
          setTimeout(() => setScanStatusMessage(''), 4000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsScanningPhoto(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 select-none">
      
      {/* HEADER TITLE & TAGLINE */}
      <div className="text-center mb-8 space-y-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>AI-Powered Recipe Generator</span>
        </motion.div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          What food do you have?
        </h1>
        <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Turn your fresh ingredients or leftover food into easy, step-by-step home recipes in seconds.
        </p>
      </div>

      {/* MAIN INPUT CARD */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* MODE SWITCHER TAB BAR */}
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleSwitchMode('fresh')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
              inputMode === 'fresh'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Utensils className={`w-4 h-4 ${inputMode === 'fresh' ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
            <span>🥗 Fresh Ingredients</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('leftovers')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
              inputMode === 'leftovers'
                ? 'bg-emerald-600 text-white shadow-md border border-emerald-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Recycle className={`w-4 h-4 ${inputMode === 'leftovers' ? 'text-emerald-200 animate-spin-slow' : ''}`} />
            <span>♻️ Leftover Food (Zero Waste)</span>
          </button>
        </div>

        {/* INPUT MODE CONTENTS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* MODE 1: FRESH INGREDIENTS */}
          {inputMode === 'fresh' && (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={freshText}
                  onChange={(e) => setFreshText(e.target.value)}
                  placeholder="e.g. Rice, tomatoes, paneer, garlic, butter, chicken..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-base resize-none outline-none transition-all shadow-inner"
                />

                {/* Micro / Camera / Photo Buttons */}
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-all"
                    title="Live Camera Scanner"
                  >
                    <Video className="w-4 h-4 text-indigo-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-all"
                    title="Upload Food Photo"
                  >
                    <ImagePlus className="w-4 h-4 text-indigo-500" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: LEFTOVER FOOD (ZERO WASTE) */}
          {inputMode === 'leftovers' && (
            <div className="space-y-6">
              
              {/* Quick Add Leftover Suggestions */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Recycle className="w-4 h-4" />
                  <span>Popular Leftover Quick-Add:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_LEFTOVER_SUGGESTIONS.map((item) => (
                    <motion.button
                      key={item.name}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAddLeftoverItem(item.name, item.defaultQty, item.freshness)}
                      className="px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer transition-all shadow-sm"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                      <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Leftover Add Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={customLeftoverName}
                  onChange={(e) => setCustomLeftoverName(e.target.value)}
                  placeholder="Type custom leftover item (e.g. Boiled Egg)..."
                  className="sm:col-span-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddLeftoverItem(customLeftoverName, customLeftoverQty)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 cursor-pointer transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Leftover</span>
                </button>
              </div>

              {/* Selected Leftovers List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Selected Leftovers ({leftoversList.length}/10):
                  </span>
                  {leftoversList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLeftoversList([])}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {leftoversList.length === 0 ? (
                  <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-semibold text-slate-500">
                    No leftover items selected yet. Click quick-add buttons above or type leftovers.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {leftoversList.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{item.quantity}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {item.freshness}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLeftoverItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AGE CATEGORY FILTER */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-indigo-500" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Cooking For (Age Group):
              </label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {AGE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedAge(cat.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedAge === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-white ${
              inputMode === 'leftovers'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:shadow-emerald-500/25'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-indigo-500/25'
            }`}
          >
            {inputMode === 'leftovers' ? (
              <>
                <Recycle className="w-5 h-5 animate-spin-slow" />
                <span>Generate Leftover Recipes (Zero Waste)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                <span>Generate Recipes</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* POPULAR DISH CARDS SECTION */}
      {inputMode === 'fresh' && (
        <div className="mt-12 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
            Or Pick Popular Instant Recipes:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HERO_DISH_CARDS.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                onClick={() => onSubmit(card.query, selectedAge)}
                className={`p-5 rounded-3xl border cursor-pointer shadow-lg space-y-3 transition-all ${card.cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                  <img src={card.photo} alt={card.title} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{card.title}</h4>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE CAMERA MODAL */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCaptureDish={(dishName) => {
          if (inputMode === 'leftovers') {
            handleAddLeftoverItem(dishName, '1 portion');
          } else {
            setFreshText(dishName);
          }
          setIsCameraOpen(false);
        }}
      />
    </div>
  );
}
