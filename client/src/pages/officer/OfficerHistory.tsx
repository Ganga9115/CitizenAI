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
  Calendar,
  MapPin,
  Filter,
  FileCheck
} from 'lucide-react';

export const OfficerHistory: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/officer/queue');
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints by Officer Department & Search & Status Filter
  const filteredHistory = complaints.filter((c) => {
    const isSameDept = !user?.department || c.department_name === user.department || c.category === user.department;
    const matchesSearch =
      c.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.summary?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return isSameDept && matchesSearch && matchesStatus;
  });

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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Analysis
            </Link>
            <Link
              to="/officer/history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
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
            <p className="text-[10px] text-white/70 truncate">{user?.department || 'Department Officer'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Case Resolution Audit Log</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history by tracking ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* CONTROL BAR */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#5E4075]" />
              <h2 className="text-sm font-extrabold text-[#1F2937]">
                Archived Logs ({filteredHistory.length})
              </h2>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <Filter className="w-3.5 h-3.5" /> Filter Status:
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              >
                <option value="All">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3.5 px-4">Tracking ID</th>
                    <th className="py-3.5 px-4">Summary</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date Logged</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4 text-right">Final Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                        Loading history logs...
                      </td>
                    </tr>
                  ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#5E4075] font-mono">{c.tracking_number}</td>
                        <td className="py-3.5 px-4 font-medium text-[#1F2937] max-w-xs truncate">
                          {c.summary || c.category}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B7280]">
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 text-[#5E4075]" /> {c.location || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#6B7280]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(c.created_at || Date.now()).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              c.priority === 'Emergency' || c.priority === 'Critical'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}
                          >
                            {c.priority || 'Medium'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              c.status === 'Resolved'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-purple-50 text-purple-600 border border-purple-200'
                            }`}
                          >
                            {c.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                        No history records matching the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};