import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { AnalyticsData } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { BarChart2, Shield, Activity, Users, Clock, AlertTriangle, Layers } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await apiClient.get('/analytics/overview');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        Loading executive analytics dashboard...
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart2 className="w-3.5 h-3.5" /> Platform Intelligence & Executive Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Executive Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Cross-department metrics, response times, and duplicate call reduction</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Total Complaints Processed</span>
            <span className="text-3xl font-extrabold text-white font-mono">{data.overview.totalComplaints}</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-red-500/30">
            <span className="text-xs text-red-300 font-semibold block mb-1">Emergency Calls</span>
            <span className="text-3xl font-extrabold text-red-400 font-mono">{data.overview.emergencyComplaints}</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30">
            <span className="text-xs text-emerald-300 font-semibold block mb-1">Avg Resolution Time</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{data.overview.avgResolutionHours} hrs</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-purple-500/30">
            <span className="text-xs text-purple-300 font-semibold block mb-1">Duplicate Calls Prevented</span>
            <span className="text-3xl font-extrabold text-purple-400 font-mono">{data.overview.duplicateReductionPercent}%</span>
          </div>
        </div>

        {/* Recharts Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Monthly Trend Area Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Monthly Call Volume & Emergency Trends
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyTrends}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="emergGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#totalGrad)" />
                  <Area type="monotone" dataKey="emergency" stroke="#ef4444" fillOpacity={1} fill="url(#emergGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Donut Chart */}
          <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Priority Breakdown
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.priorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Department Distribution Bar Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Department Complaint Load Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentDistribution}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="complaints" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
