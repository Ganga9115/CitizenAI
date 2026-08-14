import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { Complaint, ComplaintStatus } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Clock, Search, Filter, Eye, MessageSquare, Check, X, Sparkles, Layers 
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Internal Note Modal State
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const { showToast } = useNotification();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await apiClient.get('/officer/queue');
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ComplaintStatus) => {
    try {
      const res = await apiClient.patch(`/complaints/${id}/status`, { status: newStatus });
      if (res.data.success) {
        showToast('Status Updated', `Complaint status set to ${newStatus}`, 'success');
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedComplaint?.id === id) {
          setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
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
        showToast('Note Added', 'Internal field note appended', 'success');
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

  const filtered = complaints.filter(c => {
    const matchesSearch = c.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
                          c.summary.toLowerCase().includes(search.toLowerCase()) ||
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const emergencyCount = complaints.filter(c => c.priority === 'Emergency').length;
  const highCount = complaints.filter(c => c.priority === 'High').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Officer Emergency Dispatch & Triage Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">Department Complaint Triage</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time emergency prioritization, Groq transcripts, Gemini suggested actions, and duplicate detection.
          </p>
        </div>

        {/* Emergency Alert Banner if Emergency items exist */}
        {emergencyCount > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-200">Attention: {emergencyCount} Active Emergency Complaints</h4>
                <p className="text-xs text-red-300">Requires immediate dispatch crew assignment.</p>
              </div>
            </div>
            <button
              onClick={() => setPriorityFilter('Emergency')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              Filter Emergencies
            </button>
          </div>
        )}

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl glass-panel border border-red-500/30">
            <span className="text-xs text-red-300 font-semibold block mb-1">Emergency Calls</span>
            <span className="text-3xl font-extrabold text-red-400 font-mono">{emergencyCount}</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/30">
            <span className="text-xs text-amber-300 font-semibold block mb-1">High Priority</span>
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{highCount}</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-blue-500/30">
            <span className="text-xs text-blue-300 font-semibold block mb-1">Pending Triage</span>
            <span className="text-3xl font-extrabold text-blue-400 font-mono">{pendingCount}</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30">
            <span className="text-xs text-emerald-300 font-semibold block mb-1">Resolved Today</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{resolvedCount}</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID or Keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="All">Priority: All</option>
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="All">Category: All</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Garbage">Garbage</option>
                <option value="Police">Police</option>
              </select>
            </div>

          </div>
        </div>

        {/* Complaints Table */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tracking ID</th>
                  <th className="p-4">Priority & Emotion</th>
                  <th className="p-4">Category / Dept</th>
                  <th className="p-4">AI Summary & Location</th>
                  <th className="p-4">Duplicate Match</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400">
                      {c.tracking_number}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider block w-max ${
                        c.priority === 'Emergency' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {c.priority}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">Emotion: {c.emotion}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-white block">{c.category}</span>
                      <span className="text-slate-400 text-[11px]">{c.department_name}</span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="font-medium text-slate-200 truncate">{c.summary}</p>
                      <span className="text-[11px] text-indigo-300 block mt-0.5 truncate">{c.location}</span>
                    </td>

                    <td className="p-4">
                      {c.duplicate_probability > 60 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1 w-max">
                          <Layers className="w-3 h-3" /> {c.duplicate_probability}% Match
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Unique (15%)</span>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value as ComplaintStatus)}
                        className="px-2.5 py-1 rounded-lg glass-input text-[11px] font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> AI Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANEL INSPECTOR MODAL */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end animate-fadeIn">
            <div className="w-full max-w-2xl bg-[#0d1322] h-full overflow-y-auto p-6 sm:p-8 border-l border-white/15 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400">{selectedComplaint.tracking_number}</span>
                  <h3 className="text-xl font-bold text-white">AI Deep Inspection Drawer</h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gemini Recommended Action */}
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Gemini Recommended Dispatch Action
                </span>
                <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                  {selectedComplaint.suggested_action}
                </p>
              </div>

              {/* Duplicate Risk Alert if high */}
              {selectedComplaint.duplicate_probability > 60 && (
                <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-3">
                  <Layers className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block">Possible Duplicate Complaint Detected ({selectedComplaint.duplicate_probability}%)</strong>
                    <span>Similar complaint registered in the same location within last 3 hours.</span>
                  </div>
                </div>
              )}

              {/* Verbatim Groq Transcript */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Groq Whisper Speech-to-Text Transcript
                </label>
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs italic font-mono leading-relaxed border border-white/5">
                  "{selectedComplaint.transcript}"
                </div>
              </div>

              {/* Append Officer Internal Notes */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" /> Internal Field Notes
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedComplaint.notes && selectedComplaint.notes.length > 0 ? (
                    selectedComplaint.notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs">
                        <div className="flex justify-between text-slate-400 mb-1">
                          <strong className="text-indigo-300">{n.author_name}</strong>
                          <span>{new Date(n.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-200">{n.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Log field update or dispatch note..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !noteText.trim()}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                  >
                    {submittingNote ? 'Saving Note...' : 'Save Internal Note'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
