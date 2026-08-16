import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  BrainCircuit,
  LayoutDashboard,
  Upload,
  BarChart3,
  History,
  Map,
  BarChart2,
  Bell,
  Settings,
  Search,
  User,
  Terminal,
  Activity,
  ShieldCheck,
  Users
} from 'lucide-react';

export const SystemLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/audit-logs');
      if (res.data.success) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch system logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          <nav className="space-y-1">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/citizen/raise"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload
            </Link>
            <Link
              to="/scoreboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Scoreboard
            </Link>
            <Link
              to="/admin/logs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> History
            </Link>
            <Link
              to="/officer/map"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Map className="w-4 h-4" /> Map
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart2 className="w-4 h-4" /> Analytics
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Hon. Sarah Jenkins'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.department || 'Dept of Public Safety'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Platform System Audit Logs</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search action, user, IP..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stream Active
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#5E4075] uppercase tracking-wider mb-1">
                <Terminal className="w-4 h-4" /> Security Audit Console
              </div>
              <h2 className="text-xl font-extrabold text-[#1F2937]">Real-Time Event Audit Stream</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Complete system trace for user logins, routing executions, and administrative override logs.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#5E4075] border border-purple-200 text-xs font-bold font-mono shrink-0">
              Total Records: {logs.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden font-mono text-xs">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E5E7EB] font-bold text-[#5E4075] flex items-center justify-between font-sans">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5E4075]" /> Platform Logs Stream
              </span>
              <span className="text-[11px] text-[#6B7280]">Auto-Refreshed</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-[#6B7280] font-sans text-xs">Loading audit event logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-[#6B7280] font-sans text-xs">No audit log records found.</div>
            ) : (
              <div className="divide-y divide-[#E5E7EB] max-h-[600px] overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50/80 flex items-start justify-between gap-4 transition-colors">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5E4075] font-bold border border-purple-200 text-[10px]">
                          {log.action}
                        </span>
                        <span className="text-[#1F2937] font-sans font-extrabold">{log.user_name || 'System Auto-Task'}</span>
                      </div>
                      <pre className="text-[#6B7280] text-[11px] bg-[#F8FAFC] p-3 rounded-xl border border-[#E5E7EB] overflow-x-auto leading-relaxed">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>

                    <div className="text-right text-[#6B7280] text-[11px] shrink-0 font-sans">
                      <span className="font-semibold block">{new Date(log.created_at).toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-1 block">{log.ip_address || '127.0.0.1'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};