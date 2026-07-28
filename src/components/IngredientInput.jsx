import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, AlertCircle, RefreshCw, AlertTriangle, History, Flame, Users2, ArrowRight, Mic, MicOff, Camera, ImagePlus, CheckCircle2, Video, Sliders, Edit3, Check } from 'lucide-react';
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
      { name: '🍚 Mashed Curd Rice', query: 'Mashed Curd Rice' },
      { name: '🥣 Dal Pani', query: 'Dal Pani' }
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
      { name: '🧀 Paneer Bhurji', query: 'Paneer Bhurji' },
      { name: '🍔 Aloo Tikki Burger', query: 'Aloo Tikki Burger' }
    ]
  },
  {
    id: 'Teen',
    label: 'Teens & Students (Ages 13–25)',
    shortLabel: 'Ages 13–25 (Teens)',
    dishes: [
      { name: '🥘 Paneer Butter Masala', query: 'Paneer Butter Masala' },
      { name: '🫓 Aloo Paratha', query: 'Aloo Paratha' },
      { name: '🍗 Chicken Tikka Masala', query: 'Chicken Tikka Masala' },
      { name: '🥖 Chole Bhature', query: 'Chole Bhature' },
      { name: '🧈 Pav Bhaji', query: 'Pav Bhaji' }
    ]
  },
  {
    id: 'Adult',
    label: 'Adults (Ages 26–50)',
    shortLabel: 'Ages 26–50 (Adult)',
    dishes: [
      { name: '🥘 Chana Masala', query: 'Chana Masala' },
      { name: '🥬 Palak Paneer', query: 'Palak Paneer' },
      { name: '🍚 Vegetable Biryani', query: 'Vegetable Biryani' },
      { name: '🍆 Baingan Bharta', query: 'Baingan Bharta' },
      { name: '🐟 Fish Curry', query: 'Fish Curry' }
    ]
  },
  {
    id: 'Senior',
    label: 'Seniors (Ages 51+)',
    shortLabel: 'Ages 51+ (Senior)',
    dishes: [
      { name: '🌾 Oats Upma', query: 'Oats Upma' },
      { name: '🥣 Dalia Khichdi', query: 'Dalia Khichdi' },
      { name: '🍲 Toor Dal Fry', query: 'Toor Dal Fry' },
      { name: '🥒 Lauki Sabzi', query: 'Lauki Sabzi' },
      { name: '🥛 Masala Chaas', query: 'Masala Chaas' }
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
  },
  {
    id: 'palak_paneer',
    title: 'Palak Paneer',
    desc: 'Green spinach sauce with soft paneer cubes',
    badge: 'Healthy',
    query: 'Palak Paneer',
    photo: '/ingredient-images/spinach.png',
    cardBg: 'bg-emerald-50 dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-600 text-white'
  }
];

export default function IngredientInput({
  onSubmit,
  isLoading,
  recentHistory = [],
  onSelectHistory
}) {
  const [ingredientsText, setIngredientsText] = useState('');
  const [textReference, setTextReference] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(3); // Default: Adults (Ages 26-50)
  const [touched, setTouched] = useState(false);
  const [testMode, setTestMode] = useState('normal');
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [showCamOptions, setShowCamOptions] = useState(false);

  // AI Image Scanner state
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scannedImagePreview, setScannedImagePreview] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [isEditingDishName, setIsEditingDishName] = useState(false);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeCategory = AGE_CATEGORIES[selectedCategoryIndex];
  const isEmpty = !ingredientsText.trim() && !scannedImagePreview;
  const showError = touched && isEmpty;

  // Voice Input Handler via Web Speech API
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is supported in Google Chrome, Edge, and Safari browsers.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setIngredientsText(transcript);
          if (touched) setTouched(false);
        };

        recognition.onerror = (event) => {
          console.error('[Speech Recognition Error]', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('[Speech Exception]', err);
        setIsListening(false);
      }
    }
  };

  // High-Accuracy AI Food Image Feature Scanner Handler
  const processImageDataUrl = async (base64Data, filename = 'camera_photo.jpg') => {
    setScannedImagePreview(base64Data);
    setIsScanningImage(true);
    setScannedResult(null);

    try {
      // Extract color & visual features directly from image canvas
      const colorProfile = await extractImageFeatures(base64Data);

      const response = await fetch('/api/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, filename, colorProfile })
      });

      if (!response.ok) throw new Error('Image scan failed');

      const scanData = await response.json();
      setScannedResult(scanData);
      setIsScanningImage(false);

      const dishToUse = scanData.detectedDish || scanData.detectedIngredients?.join(', ') || 'Moong Dal Khichdi';
      setIngredientsText(dishToUse);
      setTouched(false);
    } catch (err) {
      console.error('[Image Scanner Error]', err);
      setIsScanningImage(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowCamOptions(false);

    const reader = new FileReader();
    reader.onload = () => {
      processImageDataUrl(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isEmpty || isLoading) return;

    let combinedQuery = ingredientsText.trim();
    if (scannedResult && !combinedQuery) {
      combinedQuery = scannedResult.detectedDish;
    }
    if (textReference.trim()) {
      combinedQuery += ` (Note: ${textReference.trim()})`;
    }

    onSubmit(combinedQuery, activeCategory.id, testMode === 'normal' ? null : testMode);
  };

  const handleSelectPreset = (presetText) => {
    setIngredientsText(presetText);
    setTouched(false);
    onSubmit(presetText, activeCategory.id, testMode === 'normal' ? null : testMode);
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 radial-glow relative overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapturePhoto={(photoDataUrl) => processImageDataUrl(photoDataUrl, 'live_camera_snap.jpg')}
      />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative z-10 my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />

        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Easy Recipe Generator
          </div>

          <div className="flex items-center gap-2">
            {recentHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg px-2.5 py-1 hover:text-indigo-600 transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-indigo-500" />
                History ({recentHistory.length})
              </button>
            )}

            <select
              value={testMode}
              onChange={(e) => setTestMode(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
            >
              <option value="normal">Normal Mode</option>
              <option value="broken_json">Test: Broken JSON</option>
              <option value="invalid_schema">Test: Invalid Schema</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          What food do you have?
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base mt-2 mb-6 leading-relaxed font-semibold">
          Scan a food photo with camera, speak, or type any dish name with custom preferences!
        </p>

        {/* AI Food Image Scanner Card (If image scanned) */}
        {scannedImagePreview && (
          <div className="mb-6 p-4 rounded-3xl bg-slate-900 text-slate-100 border border-indigo-500/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-indigo-400 shrink-0 bg-slate-950">
              <img src={scannedImagePreview} alt="Scanned Food" className="w-full h-full object-cover" />
              {isScanningImage && (
                <motion.div
                  animate={{ y: [0, 110, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-indigo-400 to-emerald-400 shadow-md shadow-emerald-400"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  {isScanningImage ? 'Analyzing Image Color & Features...' : 'AI Food Identification Result'}
                </span>
              </div>

              {isScanningImage ? (
                <p className="text-xs text-slate-300 font-bold">
                  Extracting visual features to match accurate dish name...
                </p>
              ) : (
                scannedResult && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      {isEditingDishName ? (
                        <input
                          type="text"
                          value={ingredientsText}
                          onChange={(e) => setIngredientsText(e.target.value)}
                          placeholder="Type exact dish name..."
                          className="bg-slate-800 text-white font-black text-sm px-3 py-1 rounded-xl border border-indigo-400 outline-none"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-base font-black text-white">
                          Identified: <span className="text-emerald-300">{ingredientsText || scannedResult.detectedDish}</span>
                        </h3>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsEditingDishName(!isEditingDishName)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isEditingDishName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{isEditingDishName ? 'Done' : 'Refine'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-semibold">
                      Ingredients found: {scannedResult.detectedIngredients?.join(', ')}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Recent Search History */}
        <AnimatePresence>
          {showHistory && recentHistory.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-4 rounded-2xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-slate-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-500" />
                  Recent Searches
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Click to select</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recentHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIngredientsText(item.text);
                      setShowHistory(false);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/60 border border-slate-200 dark:border-slate-700/80 cursor-pointer flex items-center justify-between gap-2 text-slate-900 dark:text-slate-200 hover:text-indigo-600 transition-all font-bold"
                  >
                    <span className="truncate max-w-md">{item.text}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form with Live Camera, Image Upload & Text Reference */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className={`glass-input rounded-2xl p-1 transition-all bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 relative ${showError ? 'ring-2 ring-rose-500 border-rose-500' : ''}`}>
              <textarea
                value={ingredientsText}
                onChange={(e) => {
                  setIngredientsText(e.target.value);
                  if (touched) setTouched(false);
                }}
                placeholder="Scan live camera, upload image, speak microphone, or type dish name..."
                rows={3}
                className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 text-base p-4 pr-28 outline-none resize-none font-bold leading-relaxed"
                autoFocus
              />

              {/* Toolbar Controls */}
              <div className="absolute right-3 top-3 flex items-center gap-1.5 z-20">
                {/* Camera Options Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCamOptions(!showCamOptions)}
                    title="Camera Scanner Options"
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  {/* Camera Options Dropdown Menu */}
                  <AnimatePresence>
                    {showCamOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl space-y-1 z-30 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShowCamOptions(false);
                            setIsLiveCameraOpen(true);
                          }}
                          className="w-full p-2.5 rounded-xl hover:bg-indigo-600/30 text-white font-bold flex items-center gap-2 text-left cursor-pointer transition-all"
                        >
                          <Video className="w-4 h-4 text-emerald-400" />
                          Live Camera Scanner
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCamOptions(false);
                            fileInputRef.current?.click();
                          }}
                          className="w-full p-2.5 rounded-xl hover:bg-indigo-600/30 text-white font-bold flex items-center gap-2 text-left cursor-pointer transition-all"
                        >
                          <ImagePlus className="w-4 h-4 text-indigo-400" />
                          Upload Photo File
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Voice Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  title={isListening ? "Stop listening" : "Click to speak dish or ingredients"}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-500/30'
                      : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Listening Status Banner */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-600 text-xs font-black mt-2 px-1"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                <span>Listening... Speak your dish name or ingredients clearly now!</span>
              </motion.div>
            )}

            {showError && !isListening && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-600 text-xs mt-2 font-black px-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Please scan photo, speak, or type a food name.
              </motion.div>
            )}
          </div>

          {/* Text Reference & Preferences Input */}
          <div className="bg-slate-100 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Text Reference & Custom Preferences (Optional):
            </label>
            <input
              type="text"
              value={textReference}
              onChange={(e) => setTextReference(e.target.value)}
              placeholder="e.g. Extra spicy, no garlic, low salt, quick 10 min cooking..."
              className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          {/* Age Group Selector */}
          <div className="space-y-2 bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-indigo-500" />
                Select Age Group:
              </label>
              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">
                {activeCategory.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {AGE_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedCategoryIndex === idx
                      ? 'age-tab-active bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:text-indigo-600 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              ))}
            </div>

            {/* Suggested Dishes */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Suggested Dishes for {activeCategory.shortLabel}:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCategory.dishes.map((dish, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => handleSelectPreset(dish.query)}
                    className="text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
                  >
                    {dish.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            type="submit"
            disabled={isEmpty || isLoading}
            whileHover={!isEmpty && !isLoading ? { scale: 1.015 } : {}}
            whileTap={!isEmpty && !isLoading ? { scale: 0.98 } : {}}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              isEmpty
                ? 'disabled-submit-btn bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed shadow-none'
                : 'enabled-submit-btn bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-indigo-500/25 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Making Recipe...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" />
                Make Recipe ({activeCategory.shortLabel})
              </>
            )}
          </motion.button>
        </form>

        {/* HERO DISH CARDS */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Popular Meals
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Click any dish to start cooking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HERO_DISH_CARDS.map((card) => (
              <motion.div
                key={card.id}
                onClick={() => handleSelectPreset(card.query)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-sm hover:shadow-md ${card.cardBg} group`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 shrink-0">
                    <img src={card.photo} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                        {card.title}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${card.badgeBg} shrink-0 shadow-xs`}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {testMode !== 'normal' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-black">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Test Mode Active: This submit will simulate a <strong>{testMode}</strong> failure.</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
