import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Complaint } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  BrainCircuit,
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Search,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  PieChart,
  ShieldAlert
} from 'lucide-react';

export const OfficerAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/officer/queue');
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Failed to fetch officer queue', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints by officer's department
  const deptComplaints = complaints.filter((c) => {
    return !user?.departmentId || c.department_name === user.departmentId || c.category === user.departmentId;
  });

  // Calculate Metrics
  const totalCount = deptComplaints.length;
  const pendingCount = deptComplaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = deptComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const completedCount = deptComplaints.filter((c) => c.status === 'Resolved').length;
  const emergencyCount = deptComplaints.filter((c) => c.priority === 'High').length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
              to="/officer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/officer/analysis"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Analysis
            </Link>
            <Link
              to="/officer/history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> History
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
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Ganga'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.departmentId || 'Department Officer'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Department Analytics & Insights</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search metrics or reports..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-[#5E4075] border border-purple-200 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-[#5E4075]" /> Dynamic Analytics
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Total Complaints</span>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#1F2937]">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#1F2937]">{totalCount}</div>
              <span className="text-[10px] text-[#6B7280] mt-1 block">Assigned to department</span>
            </div>

            {/* Pending */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Pending</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#5E4075]">{pendingCount}</div>
              <span className="text-[10px] text-purple-600 font-semibold mt-1 block">Awaiting response</span>
            </div>

            {/* In Progress */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">In Progress</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-blue-600">{inProgressCount}</div>
              <span className="text-[10px] text-blue-600 font-semibold mt-1 block">Field crew dispatched</span>
            </div>

            {/* Completed */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Completed</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Successfully resolved</span>
            </div>

            {/* Emergency */}
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280]">Emergency</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-600">{emergencyCount}</div>
              <span className="text-[10px] text-rose-600 font-semibold mt-1 block">Critical priority</span>
            </div>
          </div>

          {/* LOWER ANALYSIS CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Status Breakdown Bar */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#1F2937]">Status Breakdown & Resolution Rate</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">Distribution of all incoming civic logs</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                  {completionRate}% Resolved
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                    className="bg-emerald-500 h-full transition-all"
                    title="Completed"
                  ></div>
                  <div
                    style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}
                    className="bg-blue-500 h-full transition-all"
                    title="In Progress"
                  ></div>
                  <div
                    style={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }}
                    className="bg-[#5E4075] h-full transition-all"
                    title="Pending"
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Completed ({completedCount})
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    In Progress ({inProgressCount})
                  </div>
                  <div className="flex items-center gap-2 text-[#5E4075]">
                    <span className="w-3 h-3 rounded-full bg-[#5E4075]"></span>
                    Pending ({pendingCount})
                  </div>
                </div>
              </div>

              {/* Department Overview Details */}
              <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Department Efficiency Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                    <span className="text-[11px] text-[#6B7280] block font-semibold">Average Response Time</span>
                    <span className="text-lg font-black text-[#1F2937] mt-0.5 block">1.8 Hours</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                    <span className="text-[11px] text-[#6B7280] block font-semibold">SLA Compliance Rate</span>
                    <span className="text-lg font-black text-emerald-600 mt-0.5 block">94.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#1F2937]">Priority Distribution</h2>
                <PieChart className="w-5 h-5 text-[#5E4075]" />
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-rose-600">Emergency & Critical</span>
                    <span className="text-[#1F2937]">{emergencyCount}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${totalCount > 0 ? (emergencyCount / totalCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-600">High Priority</span>
                    <span className="text-[#1F2937]">
                      {deptComplaints.filter((c) => c.priority === 'High').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${
                          totalCount > 0
                            ? (deptComplaints.filter((c) => c.priority === 'High').length / totalCount) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#5E4075]">Medium / Low Priority</span>
                    <span className="text-[#1F2937]">
                      {deptComplaints.filter((c) => c.priority === 'Medium' || c.priority === 'Low').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#5E4075] h-full rounded-full"
                      style={{
                        width: `${
                          totalCount > 0
                            ? (deptComplaints.filter((c) => c.priority === 'Medium' || c.priority === 'Low').length /
                                totalCount) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};