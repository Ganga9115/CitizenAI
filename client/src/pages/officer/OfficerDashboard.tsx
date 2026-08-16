import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Complaint, ComplaintStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  BrainCircuit,
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Search,
  Folder,
  Clock,
  Check,
  User,
  X,
  MapIcon,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filters & Modal State
  const [search, setSearch] = useState('');
  const [queueTab, setQueueTab] = useState<'active' | 'overdue'>('active');
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

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

  const handleUpdateStatus = async (id: string, newStatus: ComplaintStatus) => {
    try {
      const res = await apiClient.patch(`/complaints/${id}/status`, { status: newStatus });
      if (res.data.success) {
        showToast('Status Updated', `Complaint status set to ${newStatus}`, 'success');
        setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
        if (selectedComplaint?.id === id) {
          setSelectedComplaint((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err: any) {
      showToast('Update Failed', err.response?.data?.message || 'Could not update status', 'error');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !noteText.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await apiClient.post(`/complaints/${selectedComplaint.id}/notes`, { note: noteText });
      if (res.data.success) {
        showToast('Note Added', 'Field note logged', 'success');
        const updatedNotes = [...(selectedComplaint.notes || []), res.data.note];
        setSelectedComplaint({ ...selectedComplaint, notes: updatedNotes });
        setNoteText('');
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to add note', 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  // Filter complaints strictly by officer department & search query
  const departmentComplaints = complaints.filter((c) => {
    const isSameDepartment = !user?.department || c.department_name === user.department || c.category === user.department;
    const matchesSearch =
      c.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.summary?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    return isSameDepartment && matchesSearch;
  });

  // Calculate Real Dynamic Metrics
  const assignedToMeCount = departmentComplaints.length;
  const pendingReviewCount = departmentComplaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = departmentComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = departmentComplaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR - PURPLE BRANDING */}
      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          {/* Navigation Items (Dashboard, Analysis, History, Notifications, Settings) */}
          <nav className="space-y-1">
            <Link
              to="/officer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
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
    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
  >
    <History className="w-4 h-4" /> History
  </Link>
  <Link
  to="/officer/map"
  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
>
  <MapIcon className="w-4 h-4" /> Live Map
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

        {/* Bottom Officer Profile Tag */}
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
          <h1 className="text-lg font-extrabold text-[#1F2937]">Operational Performance Diagnostics</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints or ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Live
            </div>

            <button className="relative w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* STAT CARDS ROW (DYNAMIC API DATA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">Assigned to Dept</span>
                <div className="w-8 h-8 rounded-lg bg-[#5E4075]/10 flex items-center justify-center text-[#5E4075]">
                  <Folder className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#1F2937]">{assignedToMeCount} Cases</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">Pending Review</span>
                <div className="w-8 h-8 rounded-lg bg-[#5E4075]/10 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#1F2937]">{pendingReviewCount} Review</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">In Progress</span>
                <div className="w-8 h-8 rounded-lg bg-[#5E4075]/10 flex items-center justify-center text-[#5E4075]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#1F2937]">{inProgressCount} Active</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">Resolved</span>
                <div className="w-8 h-8 rounded-lg bg-[#5E4075]/10 flex items-center justify-center text-[#5E4075]">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#1F2937]">{resolvedCount} Done</div>
            </div>
          </div>

          {/* LOWER GRID SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SLA INVESTIGATION QUEUE */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#1F2937]">SLA Investigation Queue</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Showing tickets logged exclusively for{' '}
                    <span className="font-bold text-[#5E4075]">{user?.department || 'your department'}</span>
                  </p>
                </div>

                <div className="bg-[#F3F4F6] p-1 rounded-xl flex items-center text-xs font-bold">
                  <button
                    onClick={() => setQueueTab('active')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      queueTab === 'active' ? 'bg-[#5E4075] text-white shadow-xs' : 'text-[#6B7280]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setQueueTab('overdue')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      queueTab === 'overdue' ? 'bg-[#5E4075] text-white shadow-xs' : 'text-[#6B7280]'
                    }`}
                  >
                    Overdue
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">Case ID</th>
                      <th className="py-3 px-4">Issue Summary</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                          Fetching department complaints queue...
                        </td>
                      </tr>
                    ) : departmentComplaints.length > 0 ? (
                      departmentComplaints.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#5E4075] font-mono">{c.tracking_number}</td>
                          <td className="py-3.5 px-4 font-medium text-[#1F2937] max-w-xs truncate">
                            {c.summary || c.category}
                          </td>
                          <td className="py-3.5 px-4 text-[#6B7280] max-w-[150px] truncate">{c.location || 'N/A'}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                                c.priority === 'Emergency' || c.priority === 'Critical'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}
                            >
                              {c.priority || 'Medium'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                c.status === 'Resolved'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : c.status === 'Pending'
                                  ? 'bg-purple-50 text-purple-600'
                                  : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedComplaint(c)}
                              className="px-3 py-1.5 rounded-lg bg-[#5E4075]/10 hover:bg-[#5E4075] text-[#5E4075] hover:text-white font-bold text-xs transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                          No complaints currently assigned to {user?.department || 'your department'}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* INSPECTOR DRAWER MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 space-y-6 border-l border-[#E5E7EB] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#5E4075]">
                  {selectedComplaint.tracking_number}
                </span>
                <h3 className="text-lg font-extrabold text-[#1F2937]">Case Deep Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#6B7280]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Suggested Action */}
            <div className="p-4 rounded-xl bg-[#5E4075]/10 border border-[#5E4075]/20 space-y-1">
              <span className="text-xs font-bold text-[#5E4075] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Recommended Dispatch Action
              </span>
              <p className="text-xs text-[#1F2937] leading-relaxed">
                {selectedComplaint.suggested_action || 'Inspect area and assign field resolution squad.'}
              </p>
            </div>

            {/* Change Status */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">Update Status</label>
              <select
                value={selectedComplaint.status}
                onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#1F2937]"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Speech-To-Text Log
              </label>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs italic font-mono text-[#1F2937]">
                "{selectedComplaint.transcript || selectedComplaint.summary}"
              </div>
            </div>

            {/* Internal Field Notes */}
            <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
              <h4 className="text-xs font-extrabold text-[#1F2937] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#5E4075]" /> Field Notes
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedComplaint.notes && selectedComplaint.notes.length > 0 ? (
                  selectedComplaint.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-gray-50 border border-[#E5E7EB] text-xs">
                      <div className="flex justify-between text-[#6B7280] mb-1">
                        <strong className="text-[#5E4075]">{n.author_name}</strong>
                        <span>{new Date(n.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[#1F2937]">{n.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6B7280] italic">No field notes logged yet.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Log dispatch note..."
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !noteText.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#5E4075] hover:bg-[#4a325d] text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
                >
                  {submittingNote ? 'Saving Note...' : 'Save Internal Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};