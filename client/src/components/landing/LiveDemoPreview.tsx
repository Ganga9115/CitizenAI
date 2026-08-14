import React, { useState } from 'react';
import { Play, Pause, Sparkles, CheckCircle2, AlertTriangle, Zap, Shield, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveDemoPreview: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleScenario = {
    audioName: "emergency_water_main_burst.wav",
    duration: "0:42",
    transcript: "Emergency call! I am calling from 45 Park Avenue. A massive main water pipeline has burst right in front of our apartment. The street is completely flooded and water is entering our ground floor basements!",
    analysis: {
      category: "Water Supply",
      priority: "Emergency",
      department: "Water Board",
      summary: "Major water main pipeline leakage causing surface flooding and basement water ingress at 45 Park Avenue.",
      sentiment: "Highly Critical",
      emotion: "Panic",
      urgency: "Immediate",
      confidence: 96.5,
      location: "45 Park Avenue, Ward 12",
      duplicateProbability: 78.5,
      suggestedAction: "Isolate main control valve #12 and dispatch Water Board Hydro Squad."
    }
  };

  const handleSimulateAI = () => {
    setIsProcessing(true);
    setActiveStep(1);
    
    setTimeout(() => {
      setActiveStep(2);
    }, 1500);

    setTimeout(() => {
      setActiveStep(3);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden my-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive AI Pipeline Preview
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Experience Real-Time Voice Intelligence</h3>
        </div>

        <button
          onClick={handleSimulateAI}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing Pipeline...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" /> Run Interactive Demo
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Audio Waveform & Groq Transcript */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Audio Player Component */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-slate-300">{sampleScenario.audioName}</span>
              <span>{sampleScenario.duration}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Animated Waveform Visualization */}
              <div className="flex-1 h-12 flex items-center gap-1.5 px-3 bg-slate-950/60 rounded-xl border border-white/5 overflow-hidden">
                {[40, 70, 30, 85, 100, 45, 90, 60, 35, 75, 95, 50, 80, 65, 40, 90, 100, 30, 70, 45, 80, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: isPlaying ? `${Math.max(15, (h * Math.random()).toFixed(0))}%` : `${h * 0.4}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Groq Whisper Speech-To-Text Output */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Groq Whisper Speech-to-Text
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Speed: 0.18s
              </span>
            </div>
            <p className="text-slate-200 text-sm italic leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
              "{sampleScenario.transcript}"
            </p>
          </div>
        </div>

        {/* Right Column: Gemini 2.5 Structured JSON Intelligence */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Gemini 2.5 Structured JSON Extraction
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                EMERGENCY PRIORITY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Recommended Department</span>
                <span className="font-bold text-white text-sm">{sampleScenario.analysis.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Extracted Emotion</span>
                <span className="font-bold text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {sampleScenario.analysis.emotion} ({sampleScenario.analysis.sentiment})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
              <span className="text-slate-400 block mb-1">AI Executive Summary</span>
              <p className="text-slate-200 leading-relaxed font-medium">{sampleScenario.analysis.summary}</p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
              <span className="text-indigo-300 font-semibold block mb-1">Suggested Emergency Action</span>
              <p className="text-indigo-100 font-medium">{sampleScenario.analysis.suggestedAction}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
              <span>Confidence Score: <strong className="text-emerald-400">96.5%</strong></span>
              <span>Duplicate Risk: <strong className="text-amber-400">78.5% (High Match)</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
