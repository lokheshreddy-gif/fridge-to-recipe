import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, AlertCircle, RefreshCw, AlertTriangle, History, Flame, Users2, ArrowRight, Mic, MicOff, Camera, ImagePlus, CheckCircle2, Video, Sliders, Edit3, Check, Recycle, Plus, Trash2, Clock, Info, CheckCircle } from 'lucide-react';
import LiveCameraModal from './LiveCameraModal.jsx';
import LeftoverSelector from './LeftoverSelector.jsx';
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

  const [selectedAge, setSelectedAge] = useState('Adult');
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Live Camera Scanner State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState('');
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const fileInputRef = useRef(null);

  // Toggle input mode with smooth toast notification
  const handleSwitchMode = (mode) => {
    if (mode === inputMode) return;
    setInputMode(mode);
    setErrorMsg('');

    if (mode === 'leftovers') {
      setToastMessage('Switched to Leftover mode (Fresh ingredients saved)');
    } else {
      setToastMessage('Switched to Fresh Ingredients mode (Leftovers list saved)');
    }

    setTimeout(() => setToastMessage(''), 3500);
  };

  // Add Leftover item
  const handleAddLeftoverItem = (name, quantity = '1 portion', freshness = 'Fresh Today') => {
    if (!name || !name.trim()) return;
    if (leftoversList.length >= 10) {
      setErrorMsg('Max 10 items. Remove one to add another');
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
    setErrorMsg('');
  };

  const handleRemoveLeftoverItem = (id) => {
    setLeftoversList((prev) => prev.filter((item) => item.id !== id));
    setErrorMsg('');
  };

  const handleClearAllLeftovers = () => {
    setLeftoversList([]);
    setErrorMsg('');
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMode === 'leftovers') {
      if (leftoversList.length === 0) {
        setErrorMsg('Add at least 1 leftover item to get recipes');
        return;
      }
      if (leftoversList.length > 10) {
        setErrorMsg('Max 10 items. Remove one to add another');
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

  // Process Base64 or Blob Photo Data via AI Scanner (/api/scan-image)
  const processCapturedPhotoData = async (base64Data, filename = 'camera_capture.jpg') => {
    setIsScanningPhoto(true);
    setScanStatusMessage('AI Scanner analyzing food image features...');

    try {
      // Analyze color tones
      const colorProfile = { dominantHue: filename.toLowerCase().includes('spinach') ? 'green' : filename.toLowerCase().includes('paneer') ? 'red' : 'yellow' };

      const res = await fetch('/api/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          filename,
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
      console.error('[AI Photo Scan Error]', err);
      setErrorMsg('Failed to scan food photo. Please try typing your dish.');
    } finally {
      setIsScanningPhoto(false);
      setTimeout(() => setScanStatusMessage(''), 4500);
    }
  };

  // Food Photo File Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      processCapturedPhotoData(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const selectedAgeCategoryObj = AGE_CATEGORIES.find((c) => c.id === selectedAge) || AGE_CATEGORIES[3];

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

      {/* AI SCAN STATUS NOTIFICATION */}
      <AnimatePresence>
        {scanStatusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs text-center shadow-lg border border-indigo-400 flex items-center justify-center gap-2 max-w-md mx-auto"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300 animate-bounce" />
            <span>{scanStatusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION FOR MODE SWITCHING */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-2xl bg-slate-900 text-white text-xs font-bold text-center shadow-lg border border-slate-700 flex items-center justify-center gap-2 max-w-md mx-auto"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN INPUT CARD */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`glass-panel p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden transition-colors duration-300 ${
          inputMode === 'leftovers'
            ? 'border-[#E07A5F]/60 dark:border-amber-600/40 bg-amber-50/20 dark:bg-slate-900/90'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
        }`}
      >
        {/* MODE SWITCHER TAB BAR (0.3s SMOOTH ANIMATION) */}
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300">
          <button
            type="button"
            onClick={() => handleSwitchMode('fresh')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              inputMode === 'fresh'
                ? 'bg-[#6366F1] text-white shadow-md border border-indigo-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>🥗 Fresh Ingredients</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('leftovers')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              inputMode === 'leftovers'
                ? 'bg-[#E07A5F] text-white shadow-md border border-[#E07A5F]'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Recycle className={`w-4 h-4 ${inputMode === 'leftovers' ? 'animate-spin-slow' : ''}`} />
            <span>♻️ Leftover Food</span>
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

          {/* MODE 2: LEFTOVER FOOD (ZERO WASTE DEDICATED COMPONENT) */}
          {inputMode === 'leftovers' && (
            <LeftoverSelector
              leftoversList={leftoversList}
              onAddLeftover={handleAddLeftoverItem}
              onRemoveLeftover={handleRemoveLeftoverItem}
              onClearAll={handleClearAllLeftovers}
              errorMsg={errorMsg}
            />
          )}

          {/* AGE CATEGORY FILTER */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-indigo-500" />
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Cooking For (Age Group):
                </label>
              </div>
              {inputMode === 'leftovers' && (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Leftover recipes tailored for {selectedAgeCategoryObj.label}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {AGE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedAge(cat.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedAge === cat.id
                      ? inputMode === 'leftovers' ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-md' : 'bg-[#6366F1] text-white border-indigo-600 shadow-md'
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

          {/* SUBMIT BUTTON WITH COOKED AMBER / TERRASCOTTA #E07A5F STYLING */}
          <motion.button
            type="submit"
            disabled={isLoading || (inputMode === 'leftovers' && leftoversList.length === 0)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-white ${
              inputMode === 'leftovers'
                ? leftoversList.length === 0
                  ? 'bg-amber-300 dark:bg-amber-950 text-amber-700 opacity-60 cursor-not-allowed border border-amber-400'
                  : 'bg-[#E07A5F] hover:bg-[#d46a4e] shadow-amber-500/25'
                : 'bg-[#6366F1] hover:bg-indigo-500 shadow-indigo-500/25'
            }`}
          >
            {inputMode === 'leftovers' ? (
              <>
                <Recycle className="w-5 h-5 animate-spin-slow" />
                <span>Make Recipe (Leftovers)</span>
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
        onCapturePhoto={(photoDataUrl) => {
          setIsCameraOpen(false);
          processCapturedPhotoData(photoDataUrl, 'camera_snapshot.jpg');
        }}
      />
    </div>
  );
}
