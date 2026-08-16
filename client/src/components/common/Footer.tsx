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
              <span className="font-bold text-lg text-white tracking-tight">Citizen Portal</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Platform for collecting citizen audio complaints and delivering structured reports to responsible departments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Tech</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">Speech-to-Text</li>
              <li className="flex items-center gap-2 text-slate-300">AI Analysis</li>
              <li className="flex items-center gap-2 text-slate-300">Database</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Portals</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Citizen Complaint Portal</li>
              <li>Officer Triage Queue</li>
              <li>Admin Analytics</li>
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
