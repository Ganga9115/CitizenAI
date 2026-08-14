import React from 'react';
import { Bot, Github, Shield, Cpu, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">CitizenAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Enterprise AI platform converting raw citizen phone call audio into structured civic complaints, automatic department routing, emergency dispatching, and duplicate detection powered by Groq Whisper & Gemini 2.5.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Tech Stack & AI</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Groq Whisper Speech-to-Text
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Bot className="w-3.5 h-3.5 text-purple-400" /> Gemini 2.5 Flash API Engine
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Supabase PostgreSQL Database
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Portals & Roles</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Citizen Audio Complaint Portal</li>
              <li>Officer Emergency Triage Queue</li>
              <li>Admin Analytics & GIS Map</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 AI-Powered Citizen Call Intelligence Platform. Built for Enterprise Civic Response.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer">
              Vercel Deployment Ready
            </span>
            <span className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer">
              Render Backend API
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
