import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Complaint } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import {
  BrainCircuit,
  LayoutDashboard,
  PlusCircle,
  History,
  Bell,
  Settings,
  Plus,
  Search,
  FolderCheck,
  Clock,
  CheckCircle2,
  Star,
  Filter,
  Eye,
  MessageSquare,
  User
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await apiClient.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter(c => {
    const matchesSearch =
      c.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status Badge Styling Helper
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700';
      case 'Pending':
      default:
        return 'bg-blue-100 text-blue-600';
    }
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

          {/* Citizen Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
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
  <Settings className="w-4 h-4" /> Account Settings
</Link>
          </nav>
        </div>

        {/* Citizen Profile Card */}
      <Link to="/profile" className="pt-4 border-t border-white/10 flex items-center gap-3 hover:opacity-90 transition-opacity">
  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
    <User className="w-5 h-5" />
  </div>
  <div className="overflow-hidden">
    <h4 className="text-xs font-bold text-white truncate">Ganga</h4>
    <p className="text-[10px] text-white/70 truncate">Citizen Account</p>
  </div>
</Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Citizen Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search my complaints by ID, category..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            {/* Notification Bell */}
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* CITIZEN WELCOME HERO */}
          <div className="p-8 rounded-2xl bg-[#5E4075] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome, Ganga</h2>
              <p className="text-[#E1D2FF] text-xs sm:text-sm mt-1.5 max-w-xl">
                Track your active civic issues, submit new audio complaints, and provide feedback on resolved tickets.
              </p>
            </div>
            <Link
              to="/citizen/raise"
              className="px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-[#5E4075] font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Raise New Complaint
            </Link>
          </div>

          {/* CITIZEN METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Raised */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs text-[#6B7280] font-medium block">Total Complaints Raised</span>
                <span className="text-2xl font-extrabold text-[#1F2937] mt-2 block">{complaints.length}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5E4075] flex items-center justify-center">
                <FolderCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Active / In Progress */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs text-[#6B7280] font-medium block">In Progress / Pending</span>
                <span className="text-2xl font-extrabold text-[#1F2937] mt-2 block">
                  {complaints.filter(c => c.status === 'In Progress' || c.status === 'Pending').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Resolved */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs text-[#6B7280] font-medium block">Resolved Complaints</span>
                <span className="text-2xl font-extrabold text-[#1F2937] mt-2 block">
                  {complaints.filter(c => c.status === 'Resolved').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Feedbacks Provided */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-start justify-between">
              <div>
                <span className="text-xs text-[#6B7280] font-medium block">Feedback Provided</span>
                <span className="text-2xl font-extrabold text-[#1F2937] mt-2 block">
                  {complaints.filter(c => c.feedback_rating).length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
          </div>

          {/* COMPLAINTS HISTORY TABLE */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-extrabold text-[#1F2937]">My Raised Complaints</h3>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#5E4075] text-white'
                        : 'bg-white text-[#6B7280] hover:text-[#1F2937] border border-[#E5E7EB]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints List */}
            {loading ? (
              <div className="p-12 text-center text-[#6B7280] text-sm">Loading your complaints...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-[#6B7280] text-sm space-y-3">
                <p>No complaints found.</p>
                <Link
                  to="/citizen/raise"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5E4075] text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Raise Your First Complaint
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#6B7280] font-bold">
                      <th className="py-3.5 px-6">Tracking ID</th>
                      <th className="py-3.5 px-6">Issue Summary</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Department</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Date Submitted</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filtered.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => navigate(`/citizen/complaint/${c.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-[#5E4075]">
                          #{c.tracking_number}
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#1F2937] max-w-xs truncate">
                          {c.summary}
                        </td>
                        <td className="py-4 px-6 text-[#6B7280] font-medium">
                          {c.category}
                        </td>
                        <td className="py-4 px-6 text-[#6B7280] font-medium">
                          {c.department_name || 'Unassigned'}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-block ${getStatusStyle(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#6B7280] whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {/* If resolved, show direct Feedback action button */}
                            {c.status === 'Resolved' && (
                              <button
                                onClick={() => navigate(`/citizen/complaint/${c.id}`)}
                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                {c.feedback_rating ? 'View Feedback' : 'Give Feedback'}
                              </button>
                            )}

                            {/* View Track Status Button */}
                            <button
                              onClick={() => navigate(`/citizen/complaint/${c.id}`)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#5E4075] text-[#1F2937] hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Track
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};