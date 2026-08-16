import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import {
  BrainCircuit,
  LayoutDashboard,
  PlusCircle,
  History,
  Bell,
  Settings,
  Search,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Lock,
  Globe
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { showToast } = useNotification();

  // Citizen Profile Form State
  const [fullName, setFullName] = useState('Ganga');
  const [email, setEmail] = useState('ganga@citizen.portal');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('42 Civic Park Avenue, Sector 5');
  const [ward, setWard] = useState('Ward 12 - South Zone');

  // Preferences State
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('Indian Standard Time (IST)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile Updated', 'Your personal details and preferences have been saved.', 'success');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR - CITIZEN NAVIGATION */}
      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> My Dashboard
            </Link>
            <Link
              to="/citizen/raise"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Raise New Complaint
            </Link>
            <a
              href="#history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> Complaint History
            </a>
            <a
              href="#notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </a>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings & Profile
            </Link>
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{fullName}</h4>
            <p className="text-[10px] text-white/70 truncate">Citizen Account</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Citizen Profile &amp; Settings</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search profile, settings..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Live
            </span>

            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* PROFILE CONTENT */}
        <main className="p-6 max-w-7xl w-full mx-auto">
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: Citizen Identity & Contact Info */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6 shadow-xs">
              <h2 className="text-sm font-extrabold text-[#1F2937] tracking-wide">Citizen Identity</h2>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center justify-center space-y-3 pb-2">
                <div className="w-24 h-24 rounded-full bg-[#5E4075]/10 border-2 border-[#5E4075]/20 flex items-center justify-center text-[#5E4075] overflow-hidden">
                  <User className="w-12 h-12" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-[#5E4075] text-white font-bold text-xs hover:bg-[#4C3360] transition-colors"
                  >
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] font-semibold text-xs hover:bg-gray-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">Residential Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">Assigned Civic Ward / Sector</label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Security, Notifications & Localization */}
            <div className="lg:col-span-7 space-y-6">

              {/* Security & Verification Box */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
                <h2 className="text-sm font-extrabold text-[#1F2937] tracking-wide">Security &amp; Account Verification</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password / Security Token */}
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1">Password</label>
                    <div className="flex items-center justify-between p-2.5 border border-[#E5E7EB] rounded-xl bg-[#F8FAFC]">
                      <span className="text-xs font-mono text-[#6B7280]">••••••••••••</span>
                      <button
                        type="button"
                        onClick={() => showToast('Password Reset Link Sent', 'Check your registered email address.', 'info')}
                        className="text-xs font-bold text-[#5E4075] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1">Citizen Identity Verification</label>
                    <div className="flex items-center justify-between p-2.5 border border-emerald-200 bg-emerald-50/50 rounded-xl">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Citizen
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Citizen Notification Settings */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
                <h2 className="text-sm font-extrabold text-[#1F2937] tracking-wide">Complaint Alert Preferences</h2>

                {/* SMS Toggle */}
                <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">SMS Updates &amp; Critical Emergency Alerts</h4>
                    <p className="text-[11px] text-[#6B7280]">Receive immediate SMS alerts when your complaint status changes or hazards are nearby.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsNotifications(!smsNotifications)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      smsNotifications ? 'bg-[#5E4075]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        smsNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">Email Resolution Summaries</h4>
                    <p className="text-[11px] text-[#6B7280]">E-mail official department reports and feedback request receipts when issues are resolved.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      emailNotifications ? 'bg-[#5E4075]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Display & Localization */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
                <h2 className="text-sm font-extrabold text-[#1F2937] tracking-wide">Display &amp; Localization</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1">System Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] bg-white focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    >
                      <option>English (US)</option>
                      <option>Hindi (हिंदी)</option>
                      <option>Tamil (தமிழ்)</option>
                      <option>Spanish (Español)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] bg-white focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    >
                      <option>Indian Standard Time (IST)</option>
                      <option>Eastern Standard Time (EST)</option>
                      <option>Central European Time (CET)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Account Deactivation Requested', 'Contact support to complete account deletion.', 'warning')}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                >
                  Deactivate Account
                </button>
              </div>

            </div>
          </form>
        </main>
      </div>
    </div>
  );
};