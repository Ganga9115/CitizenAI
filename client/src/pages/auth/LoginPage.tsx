import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Check, CreditCard, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { apiClient } from '../../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-[#1F2937]">
      {/* LEFT SIDE - Purple Banner */}
      <div className="lg:col-span-5 bg-[#5E4075] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              CivicAI
            </span>
          </Link>

          {/* Hero Content */}
          <div className="mt-24 sm:mt-32 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Modern Intelligence for Civil Infrastructure
            </h1>
            <p className="mt-6 text-[#E1D2FF] text-sm sm:text-base leading-relaxed">
              Connecting federal and municipal administration teams directly to real-time public logs via premium Natural Language Processing models. Secure, verified, and audited.
            </p>
          </div>
        </div>

        {/* Badges Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#E1D2FF]/80 mb-3">
            Certified Government Standard
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/90">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" /> SOC2 Compliant
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" /> HIPAA Aligned
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#E1D2FF]" /> FedRAMP High Ready
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="max-w-md w-full">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#F3F4F6] p-1 rounded-xl flex items-center w-full max-w-xs text-xs font-semibold">
              <button
                type="button"
                className="flex-1 py-2 rounded-lg bg-white text-[#1F2937] shadow-sm transition-all text-center"
              >
                Login
              </button>
              <Link
                to="/register"
                className="flex-1 py-2 rounded-lg text-[#6B7280] hover:text-[#1F2937] transition-all text-center"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
              Enter your civic credentials to access administrative systems.
            </p>
          </div>

          {/* Quick Preset Accounts */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB]">
            <span className="text-[#5E4075] font-bold block mb-2 text-[10px] uppercase tracking-wider">
              ⚡ Demo Preset Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('CITIZEN')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-[#E1D2FF]/30 text-[#5E4075] border border-[#E5E7EB] transition-colors font-medium text-xs shadow-xs"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('OFFICER')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-[#E1D2FF]/30 text-[#5E4075] border border-[#E5E7EB] transition-colors font-medium text-xs shadow-xs"
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="py-1.5 px-2 rounded-lg bg-white hover:bg-[#E1D2FF]/30 text-[#5E4075] border border-[#E5E7EB] transition-colors font-medium text-xs shadow-xs"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.jenkins@municipal.gov"
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#5E4075] focus:ring-1 focus:ring-[#5E4075] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#6B7280] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#E5E7EB] text-[#5E4075] focus:ring-[#5E4075]"
                />
                <span>Remember this machine</span>
              </label>
              <a href="#forgot" className="text-[#5E4075] font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#5E4075] hover:bg-[#4a325d] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In Securely'
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
              Or Sign In With
            </span>
          </div>

          {/* Alternative SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-[#5E4075]" /> CAC/PIV Smartcard
            </button>
            <button
              type="button"
              className="py-2.5 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#1F2937] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4 text-[#5E4075]" /> SAML Single Sign-On
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};