import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { apiClient } from '../../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickLogin = (role: 'CITIZEN' | 'OFFICER' | 'ADMIN') => {
    if (role === 'CITIZEN') {
      setEmail('citizen@city.gov');
      setPassword('password123');
    } else if (role === 'OFFICER') {
      setEmail('officer@water.gov');
      setPassword('password123');
    } else {
      setEmail('admin@city.gov');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast('Login Successful', `Welcome back ${res.data.user.fullName}!`, 'success');

        const role = res.data.user.role;
        if (role === 'CITIZEN') navigate('/citizen/dashboard');
        else if (role === 'OFFICER') navigate('/officer/dashboard');
        else if (role === 'ADMIN') navigate('/admin/dashboard');
      }
    } catch (err: any) {
      showToast('Authentication Error', err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#090d16] text-slate-100 relative">
      
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/15 shadow-2xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">CitizenAI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Sign In to Platform</h2>
          <p className="text-slate-400 text-xs mt-1">Access your Citizen, Officer, or Admin workspace</p>
        </div>

        {/* Quick Demo Login Presets */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 text-xs">
          <span className="text-indigo-300 font-semibold block mb-2 text-[11px] uppercase tracking-wider">
            ⚡ Quick One-Click Preset Credentials
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('CITIZEN')}
              className="py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors font-medium text-[11px]"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('OFFICER')}
              className="py-1.5 px-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors font-medium text-[11px]"
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors font-medium text-[11px]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@city.gov"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
