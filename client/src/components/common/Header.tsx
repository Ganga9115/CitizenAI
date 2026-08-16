import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, BrainCircuit } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo matching the cropped image */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#5E4075] flex items-center justify-center text-white shadow-sm">
            <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#1F2937]">
            CivicAI
          </span>
        </Link>

        {/* Navigation items from image + auth routing support */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {user ? (
            <>
              {user.role === 'CITIZEN' && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    className={`transition-colors ${
                      location.pathname.includes('/citizen/dashboard')
                        ? 'text-[#1F2937] font-semibold'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    My Complaints
                  </Link>
                  <Link
                    to="/citizen/raise"
                    className={`transition-colors ${
                      location.pathname.includes('/citizen/raise')
                        ? 'text-[#1F2937] font-semibold'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    Raise Complaint
                  </Link>
                </>
              )}

              {user.role === 'OFFICER' && (
                <Link
                  to="/officer/dashboard"
                  className={`transition-colors ${
                    location.pathname.includes('/officer/dashboard')
                      ? 'text-[#1F2937] font-semibold'
                      : 'text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  Triage Queue
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`transition-colors ${
                      location.pathname.includes('/admin/dashboard')
                        ? 'text-[#1F2937] font-semibold'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`transition-colors ${
                      location.pathname.includes('/admin/users')
                        ? 'text-[#1F2937] font-semibold'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    Users & Officers
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <a href="#features" className="text-[#1F2937] font-semibold hover:text-[#5E4075] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-[#6B7280] hover:text-[#1F2937] transition-colors">
                How it Works
              </a>
              <a href="#departments" className="text-[#6B7280] hover:text-[#1F2937] transition-colors">
                Departments
              </a>
              <a href="#security" className="text-[#6B7280] hover:text-[#1F2937] transition-colors">
                Security
              </a>
              <a href="#pricing" className="text-[#6B7280] hover:text-[#1F2937] transition-colors">
                Pricing
              </a>
            </>
          )}
        </nav>

        {/* User Status / Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-[#1F2937]">{user.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1D2FF] text-[#5E4075] uppercase font-mono font-medium">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-[#F3F4F6] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB]"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#5E4075] hover:text-[#4a325d] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#5E4075] hover:bg-[#4a325d] rounded-lg shadow-sm transition-all"
              >
                Request Demo
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};