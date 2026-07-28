import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Film, Flame, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';

export default function AnimatedDishVideo({ recipe }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeScene, setActiveScene] = useState(0); // 0: Searing, 1: Saucemaking, 2: Plating
  const [isMuted, setIsMuted] = useState(false);

  const scenes = [
    {
      id: 'prep',
      title: 'Phase 1: Prep & Sear',
      subtitle: `Searing main ingredients over high heat`,
      desc: 'Heat skillet with oil. Add seasoned ingredients until golden crust forms.',
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/40'
    },
    {
      id: 'saute',
      title: 'Phase 2: Aromatics & Sauce',
      subtitle: 'Simmering garlic, butter & pan juices',
      desc: 'Lower flame, toss in aromatics, and baste continuously until fragrant.',
      color: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/40'
    },
    {
      id: 'finish',
      title: 'Phase 3: Garnish & Plating',
      subtitle: 'Plating hot & finishing with fresh herbs',
      desc: 'Rest main protein, spoon glossy sauce over top, and garnish generously.',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/40'
    }
  ];

  // Video Progress Timer simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop video animation
          }
          const next = prev + 1;
          // Synchronize scene based on progress
          if (next < 35) setActiveScene(0);
          else if (next < 70) setActiveScene(1);
          else setActiveScene(2);
          return next;
        });
      }, 150); // 15s total video loop
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRestart = () => {
    setProgress(0);
    setActiveScene(0);
    setIsPlaying(true);
  };

  const handleSceneClick = (index) => {
    setActiveScene(index);
    setProgress(index === 0 ? 0 : index === 1 ? 40 : 75);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Dish Animation Reference
              <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-semibold">
                Simulated Video
              </span>
            </h3>
            <p className="text-xs text-slate-400">Animated cooking reference for {recipe.title}</p>
          </div>
        </div>

        {/* Mute/Sound Toggle Simulation */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
        </button>
      </div>

      {/* Video Viewport Stage Container */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6">
        {/* Animated Background Canvas Simulation */}
        <div className={`absolute inset-0 bg-gradient-to-br ${scenes[activeScene].color} transition-all duration-700`} />

        {/* Ambient Steam Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, -120],
                x: [i * 30, i * 30 + (i % 2 === 0 ? 20 : -20)],
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.5]
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut'
              }}
              className="absolute bottom-10 left-1/4 w-8 h-8 rounded-full bg-white/10 blur-xl"
            />
          ))}
        </div>

        {/* Top Video Overlay Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            REC 00:{Math.floor(progress / 3.3).toString().padStart(2, '0')} / 00:30
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            HD 1080p AI Video
          </span>
        </div>

        {/* Central Animated Scene Graphic */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Graphic Stage Elements */}
              {activeScene === 0 && (
                <div className="relative mb-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400/40 flex items-center justify-center"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-14 h-14 rounded-2xl bg-amber-500/30 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20"
                    >
                      <Flame className="w-8 h-8 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              )}

              {activeScene === 1 && (
                <div className="relative mb-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-purple-300 animate-spin" />
                  </motion.div>
                </div>
              )}

              {activeScene === 2 && (
                <div className="relative mb-3">
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-emerald-300" />
                  </motion.div>
                </div>
              )}

              {/* Scene Title & Instruction overlay */}
              <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow-md">
                {scenes[activeScene].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md font-medium drop-shadow-sm px-4">
                {scenes[activeScene].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Video Controls Overlay */}
        <div className="relative z-10 space-y-2">
          {/* Progress Timeline Scrub Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = Math.round((clickX / rect.width) * 100);
              setProgress(newPct);
              if (newPct < 35) setActiveScene(0);
              else if (newPct < 70) setActiveScene(1);
              else setActiveScene(2);
            }}
            className="w-full h-2 bg-slate-900/90 rounded-full border border-slate-700/80 overflow-hidden cursor-pointer p-0.5"
          >
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400 rounded-full transition-all duration-150"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 border border-slate-700/80 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scene Selector Buttons */}
            <div className="flex items-center gap-1.5">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSceneClick(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeScene === idx
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Phase {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
