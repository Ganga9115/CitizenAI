import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsData } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
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
  Plus,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Activity,
  Shield
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/overview');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin overview analytics', err);
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
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
          <h1 className="text-lg font-extrabold text-[#1F2937]">System Admin & Governance Center</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search complaints, metrics, routes..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Live
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TOP METRIC CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Total Users</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">
                {data?.overview ? data.overview.totalComplaints * 3 + 1245 : '1,245'} Registered
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↑ +8.2% <span className="text-[#6B7280] font-normal">vs last week</span>
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Active Officers</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">84 Dispatched</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↑ +14.1% <span className="text-[#6B7280] font-normal">vs last week</span>
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">System Health</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">99.98% OK</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↑ +0.01% <span className="text-[#6B7280] font-normal">vs last week</span>
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Daily API Cost</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">8.4k Tokens</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↑ -12.4% <span className="text-[#6B7280] font-normal">vs last week</span>
              </span>
            </div>
          </div>

          {/* ADMIN QUICK CONTROLS BAR */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h3 className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider mb-3">
              Admin Quick Controls
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/users"
                className="px-4 py-2.5 rounded-xl bg-[#5E4075] hover:bg-[#4d3361] text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Municipal User
              </Link>
              <button className="px-4 py-2.5 rounded-xl bg-white border border-[#5E4075] text-[#5E4075] hover:bg-purple-50 text-xs font-bold flex items-center gap-2 transition-colors">
                <Building2 className="w-4 h-4" /> Integrate Department
              </button>
              <Link
                to="/admin/logs"
                className="px-4 py-2.5 rounded-xl bg-white border border-[#5E4075] text-[#5E4075] hover:bg-purple-50 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> System Config Audit
              </Link>
            </div>
          </div>

          {/* REGISTERS & SECURITY AUDIT LOGS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Municipal Officer Registers Table */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#1F2937]">Municipal Officer Registers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-right">SLA Metrics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <tr className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#5E4075]">
                          DJ
                        </div>
                        <div>
                          <strong className="text-[#1F2937] block font-bold">Sgt. David Jenkins</strong>
                          <span className="text-[#6B7280] text-[10px]">david.jenkins@city.gov</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#1F2937] font-semibold">Public Works</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-200 text-[10px]">
                          98% On Time
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#5E4075]">
                          AM
                        </div>
                        <div>
                          <strong className="text-[#1F2937] block font-bold">Sgt. Amanda Miller</strong>
                          <span className="text-[#6B7280] text-[10px]">amanda.miller@city.gov</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#1F2937] font-semibold">Sanitation</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-extrabold border border-amber-200 text-[10px]">
                          84% On Time
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security & Routing Audit Logs */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#1F2937]">Security & Routing Audit Logs</h3>
              <div className="space-y-4 text-xs pt-1">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <div>
                    <strong className="text-[#1F2937] block font-bold">API Credentials Synced</strong>
                    <span className="text-[#6B7280] text-[10px]">Federal Gateway Router • 4 mins ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                  <div>
                    <strong className="text-[#1F2937] block font-bold">12 Water Cases Auto-Routed</strong>
                    <span className="text-[#6B7280] text-[10px]">Public Works API Pipeline • 10 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC ANALYTICS CHARTS SECTION */}
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Monthly Volume Trend */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#5E4075]" /> Dynamic Complaint Volume & Emergency Trends
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthlyTrends}>
                      <defs>
                        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5E4075" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#5E4075" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="total" stroke="#5E4075" fillOpacity={1} fill="url(#totalGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Load Bar Chart */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#5E4075]" /> Department Complaint Load
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.departmentDistribution}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px' }} />
                      <Bar dataKey="complaints" fill="#5E4075" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};