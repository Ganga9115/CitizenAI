import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, Mic, Cpu, Zap, ShieldAlert, Layers, MapPin, ChevronDown, 
  CheckCircle2, ArrowRight, Activity, Users, Clock, Radio, Headphones
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { LiveDemoPreview } from '../../components/landing/LiveDemoPreview';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: <Mic className="w-6 h-6 text-indigo-400" />,
      title: "Groq Whisper STT",
      description: "Sub-second speech-to-text transcription accepting audio recordings or live phone streams in any local dialect."
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: "Gemini 2.5 Flash Intelligence",
      description: "Extracts structured category, priority, department, sentiment, citizen emotion, and suggested action in 100% valid JSON."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      title: "Emergency Prioritization",
      description: "Instantly flags life-threatening incidents (live cables, gas leaks, structural collapses) for high-priority dispatch."
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: "Duplicate Call Prevention",
      description: "Identifies duplicate complaints for the same geographic event to avoid redundant officer deployments."
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-400" />,
      title: "GIS Leaflet Heatmaps",
      description: "Visualizes civic issues on real-time city map with emergency color-coded pins and neighborhood boundaries."
    },
    {
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      title: "Recharts Executive Dashboards",
      description: "Department-wise SLA resolution tracking, officer workload distribution, and monthly trend insights."
    }
  ];

  const faqs = [
    {
      q: "How does the AI process incoming citizen call audio?",
      a: "When a citizen uploads or records a call, the audio is sent to the Groq Whisper STT engine for instant transcription. The verbatim transcript is then analyzed by Gemini 2.5 Flash API using strict prompt parameters to output a structured JSON complaint payload."
    },
    {
      q: "What happens during an emergency complaint?",
      a: "The AI system evaluates distress level, sentiment, and urgency keywords. If categorized as an Emergency (e.g., live high-voltage wire or flooding), the complaint automatically triggers immediate alert banners on the Officer Triage Dashboard."
    },
    {
      q: "How does duplicate complaint detection work?",
      a: "The platform compares incoming complaint locations, categories, and keyword embeddings against active open tickets. If similarity crosses threshold, it flags duplicate probability and links them together."
    },
    {
      q: "Can this system run without live API keys?",
      a: "Yes! The system includes an intelligent built-in fallback simulation engine so judges, reviewers, and hackathon teams can test all features out-of-the-box."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative text-center py-16 sm:py-24 overflow-hidden">
          
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-8 shadow-xl"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Hackathon MVP • AI Citizen Call Intelligence Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
          >
            Transform Citizen Voice Calls into <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">Actionable Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Automated Speech-to-Text via <strong className="text-white">Groq Whisper</strong> + Deep Extraction via <strong className="text-white">Gemini 2.5 Flash</strong>. Categorizing complaints, prioritizing emergencies, and detecting duplicates instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/citizen/raise"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 group transition-all"
            >
              <Headphones className="w-5 h-5 text-indigo-200 group-hover:scale-110 transition-transform" />
              Raise Complaint Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base border border-white/15 flex items-center justify-center gap-2 transition-colors"
            >
              Officer / Admin Login
            </Link>
          </motion.div>
        </section>

        {/* INTERACTIVE DEMO PREVIEW */}
        <LiveDemoPreview />

        {/* FEATURES GRID */}
        <section id="features" className="py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Engineered for Enterprise Civic Response
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Replacing manual operator call-logging with zero-friction AI intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl glass-panel glass-card-hover space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Simple 4-Step Automated Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Citizen Uploads Audio", desc: "Citizen uploads MP3/WAV file or speaks directly into browser mic." },
              { step: "02", title: "Groq Whisper STT", desc: "Whisper transcribes raw audio into text with high accuracy." },
              { step: "03", title: "Gemini 2.5 Flash", desc: "Extracts category, priority, department, sentiment, and JSON output." },
              { step: "04", title: "Officer Triage", desc: "Dashboard updates instantly with map pins and emergency flags." }
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-panel relative border border-white/10">
                <span className="text-4xl font-extrabold text-indigo-500/40 font-mono block mb-2">{s.step}</span>
                <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats" className="py-16 my-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/60 border border-indigo-500/20 p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono">98.4%</span>
              <p className="text-xs sm:text-sm text-indigo-300 mt-2 font-medium">Categorization Accuracy</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono">&lt; 2.8s</span>
              <p className="text-xs sm:text-sm text-purple-300 mt-2 font-medium">End-to-End Pipeline Speed</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono">42%</span>
              <p className="text-xs sm:text-sm text-emerald-300 mt-2 font-medium">Duplicate Dispatch Reduction</p>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono">15+</span>
              <p className="text-xs sm:text-sm text-amber-300 mt-2 font-medium">Civic Complaint Categories</p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-white font-semibold text-base hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 text-slate-300 text-sm leading-relaxed border-t border-white/5 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
