import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Film, Flame, Sparkles, Volume2, VolumeX, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AnimatedDishVideo({ recipe }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [activePhase, setActivePhase] = useState(0); // 0: Prep, 1: Adding, 2: Cooking, 3: Plating
  const [isMuted, setIsMuted] = useState(false);

  const videoPhases = [
    {
      id: 'prep',
      title: '1. Assembling Fresh Ingredients',
      subtitle: 'Raw ingredients prepped & portioned on slate board',
      desc: 'Portion raw chicken breasts, crush fresh garlic, slice lemons, and gather crisp baby spinach.',
      image: '/assets/step1_prep.png',
      badge: 'PREP & PORTION'
    },
    {
      id: 'adding',
      title: '2. Adding Ingredients to Hot Skillet',
      subtitle: 'Dropping minced garlic & fresh herbs into sizzling oil',
      desc: 'Heat extra virgin olive oil in a heavy cast iron skillet. Drop minced garlic and fresh herbs into the hot oil with a sizzling splash.',
      image: '/assets/step2_adding.png',
      badge: 'SIZZLE & ADD'
    },
    {
      id: 'cooking',
      title: '3. Searing & Wilting Greens',
      subtitle: 'Sear golden chicken breasts & wilt spinach in pan sauce',
      desc: 'Sear seasoned chicken breasts 5-6 mins per side until deep golden crust forms. Toss in baby spinach until just wilted in lemon garlic butter.',
      image: '/assets/step3_cooking.png',
      badge: 'SEAR & SIMMER'
    },
    {
      id: 'plated',
      title: '4. Gourmet Plating & Serving',
      subtitle: 'Plated hot with lemon squeeze & pan drippings',
      desc: 'Plate tender chicken atop silky wilted spinach, drizzle warm garlic butter pan drippings, and garnish with fresh herbs.',
      image: '/assets/step4_plated.png',
      badge: 'READY TO SERVE'
    }
  ];

  // Video progress timer loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0; // Loop video automatically
          const next = prev + 1;
          
          // Sync 4 real-life video phases based on progress timestamp
          if (next < 25) setActivePhase(0);
          else if (next < 50) setActivePhase(1);
          else if (next < 75) setActivePhase(2);
          else setActivePhase(3);

          return next;
        });
      }, 160); // 16s total realistic video playback loop
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRestart = () => {
    setProgress(0);
    setActivePhase(0);
    setIsPlaying(true);
  };

  const handlePhaseSelect = (index) => {
    setActivePhase(index);
    setProgress(index * 25);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 border border-pink-400/40 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Real-Life Cooking Video Reference
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Live Action 4K
              </span>
            </h3>
            <p className="text-xs text-slate-400">Step-by-step visual demonstration of adding ingredients & cooking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>
        </div>
      </div>

      {/* Video Stage Frame */}
      <div className="relative w-full aspect-video sm:aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 group">
        
        {/* Real-life background video frame with subtle Ken Burns cinematic zoom */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${videoPhases[activePhase].image})` }}
          >
            {/* Cinematic dark vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40" />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Steam & Heat Sizzle overlay animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, -100],
                x: [i * 45, i * 45 + (i % 2 === 0 ? 15 : -15)],
                opacity: [0, 0.45, 0],
                scale: [0.9, 1.6]
              }}
              transition={{
                duration: 2.5 + (i % 2),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut'
              }}
              className="absolute bottom-12 left-1/3 w-10 h-10 rounded-full bg-white/10 blur-xl"
            />
          ))}
        </div>

        {/* Top Video Overlay Bar */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-100 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            LIVE 00:{Math.floor(progress * 0.16).toString().padStart(2, '0')} / 00:16
          </div>

          <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider backdrop-blur-md">
            {videoPhases[activePhase].badge}
          </span>
        </div>

        {/* Real-Life Scene Text & Description overlay */}
        <div className="relative z-20 max-w-xl my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-slate-950/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {videoPhases[activePhase].subtitle}
              </div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                {videoPhases[activePhase].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-medium">
                {videoPhases[activePhase].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Video Controls & Scrub Timeline Bar */}
        <div className="relative z-20 space-y-2.5">
          {/* Progress Timeline Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = Math.round((clickX / rect.width) * 100);
              setProgress(newPct);
              if (newPct < 25) setActivePhase(0);
              else if (newPct < 50) setActivePhase(1);
              else if (newPct < 75) setActivePhase(2);
              else setActivePhase(3);
            }}
            className="w-full h-2.5 bg-slate-950/90 backdrop-blur-md rounded-full border border-slate-700/80 overflow-hidden cursor-pointer p-0.5"
          >
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-emerald-400 rounded-full transition-all duration-150 shadow-sm"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold hover:bg-slate-200 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-9 h-9 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-700/80 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scene Selector Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
              {videoPhases.map((phase, idx) => (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => handlePhaseSelect(idx)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activePhase === idx
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md border border-indigo-400/40'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
