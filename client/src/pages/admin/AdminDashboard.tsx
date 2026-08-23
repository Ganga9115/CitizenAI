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
  BarChart3,
  BarChart2,
  Bell,
  Search,
  User,
  CheckCircle2,
  Users,
  Clock,
  Activity,
  Shield,
  ArrowRight,
  Layers,
  FileCheck
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
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937] w-full">
      {/* LEFT SIDEBAR - STREAMLINED NAVIGATION */}
      <aside className="w-1/5 min-w-[220px] max-w-[280px] bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          <nav className="space-y-1.5">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <BarChart2 className="w-4 h-4" /> Analytics & Trends
            </Link>
            <Link
              to="/scoreboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Scoreboard
            </Link>
            <Link
              to="/admin/unique-complaints"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Unique Complaints
            </Link>
            <Link
              to="/admin/officers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Users className="w-4 h-4" /> Department Officers
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Ganga'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.departmentId || 'System Administrator'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10 w-full">
          <div>
            <h1 className="text-lg font-extrabold text-[#1F2937]">Governance & Analytics Dashboard</h1>
            <p className="text-xs text-[#6B7280]">Unified view for system analytics, trends, and performance metrics</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-72 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search complaints, officers, departments..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live System
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-6 w-full mx-auto space-y-8">
          
          {/* KEY PERFORMANCE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6B7280]">Unique Complaints</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">
                {data?.overview ? data.overview.totalComplaints : '342'}
              </div>
              <span className="text-[10px] text-purple-600 font-bold mt-1 inline-flex items-center gap-1">
                Deduplicated via AI Clustering
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6B7280]">Active Duty Officers</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">48 Field Lead Officers</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↑ 92% SLA Compliance
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6B7280]">Avg. Resolution Time</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">4.2 Hours</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                ↓ -18% faster vs last week
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6B7280]">System Efficiency</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1F2937]">98.4%</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                Zero duplicates routed
              </span>
            </div>
          </div>

          {/* SYSTEM ANALYTICS & TRENDS */}
          <section id="analytics" className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#1F2937] flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#5E4075]" /> System Analytics
              </h2>
              <Link to="/scoreboard" className="text-xs font-bold text-[#5E4075] hover:underline flex items-center gap-1">
                View Full Scoreboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#6B7280]">
                Loading system analytics...
              </div>
            ) : data ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                {/* Monthly Volume Trend */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                  <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#5E4075]" /> Dynamic Complaint Volume
                  </h3>
                  <div className="h-60 w-full">
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

                {/* Department Load Distribution */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
                  <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#5E4075]" /> Department Complaint Load
                  </h3>
                  <div className="h-60 w-full">
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
            ) : null}
          </section>

        </main>
      </div>
    </div>
  );
};