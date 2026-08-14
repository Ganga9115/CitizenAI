import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bot, LogOut, User as UserIcon, Shield, Headphones, BarChart2, Radio, Trophy } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Citizen<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Call Intelligence Platform
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {user ? (
            <>
              {user.role === 'CITIZEN' && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/citizen/dashboard') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Headphones className="w-4 h-4" /> My Complaints
                  </Link>
                  <Link
                    to="/citizen/raise"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/citizen/raise') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Raise Complaint
                  </Link>
                </>
              )}

              {user.role === 'OFFICER' && (
                <>
                  <Link
                    to="/officer/dashboard"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/officer/dashboard') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-indigo-400" /> Triage Queue
                  </Link>
                  <Link
                    to="/officer/map"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/officer/map') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    GIS City Map
                  </Link>
                </>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/admin/dashboard') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <BarChart2 className="w-4 h-4 text-purple-400" /> Analytics
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname.includes('/admin/users') ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Users & Officers
                  </Link>
                </>
              )}

              {/* Department Performance Scoreboard Link (Available to All Roles) */}
              <Link
                to="/scoreboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/scoreboard' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" /> Scoreboard
              </Link>
            </>
          ) : (
            <>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <Link to="/scoreboard" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Scoreboard
              </Link>
            </>
          )}
        </nav>

        {/* User Status / Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-100">{user.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono font-medium">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-white/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
