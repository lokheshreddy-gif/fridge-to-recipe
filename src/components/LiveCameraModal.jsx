import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RefreshCw, Sparkles, Check, AlertTriangle } from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapturePhoto }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isStarting, setIsStarting] = useState(true);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'

  // Start live webcam / mobile camera stream
  const startCamera = async (mode = facingMode) => {
    setIsStarting(true);
    setCameraError('');

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsStarting(false);
    } catch (err) {
      console.error('[Live Camera Error]', err);
      setCameraError('Camera access denied or unavailable. Please check permissions or upload a photo.');
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleToggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      // Stop camera and send photo to parent
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      onCapturePhoto(photoDataUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl overflow-hidden relative flex flex-col items-center"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Live Food Camera Scanner</h3>
              <p className="text-[11px] font-bold text-slate-400">Aim at food items or dishes</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Video Viewfinder */}
        <div className="relative w-full h-72 bg-slate-950 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-inner flex items-center justify-center">
          {isStarting && (
            <div className="flex flex-col items-center gap-2 text-indigo-400 text-xs font-bold">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
              <span>Starting Live Camera...</span>
            </div>
          )}

          {cameraError && (
            <div className="p-4 text-center text-rose-400 text-xs font-bold space-y-2">
              <AlertTriangle className="w-6 h-6 mx-auto text-rose-500" />
              <p>{cameraError}</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isStarting || cameraError ? 'hidden' : 'block'}`}
          />

          {/* Viewfinder Target Reticle Overlay */}
          {!isStarting && !cameraError && (
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-400/40">
                  Align Food Item Inside Frame
                </span>
              </div>
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>
          )}

          {/* Offscreen Canvas for Snap */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center justify-between gap-3 mt-5">
          <button
            type="button"
            onClick={handleToggleCamera}
            disabled={!stream || isStarting}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Switch Cam
          </button>

          <button
            type="button"
            onClick={handleSnapPhoto}
            disabled={!stream || isStarting || !!cameraError}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            Snap & Scan Photo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
