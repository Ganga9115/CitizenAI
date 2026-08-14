import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { Complaint } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  Headphones, Plus, Search, Filter, AlertTriangle, Clock, CheckCircle2, ChevronRight, MapPin, Users, ThumbsUp 
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { showToast } = useNotification();

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

  const handleEndorse = async (e: React.MouseEvent, complaintId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await apiClient.post(`/complaints/${complaintId}/endorse`);
      if (res.data.success) {
        showToast('Endorsed!', 'You are registered as an affected citizen. Issue priority escalated.', 'success');
        setComplaints(prev => prev.map(c => c.id === complaintId ? res.data.complaint : c));
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to endorse complaint', 'error');
    }
  };

  const filtered = complaints.filter(c => {
    const matchesSearch = c.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
                          c.summary.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header & New Complaint CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Citizen Complaint Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Track civic complaints, amplify existing issues, and evaluate government departments.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scoreboard"
              className="px-4 py-3 rounded-xl glass-panel hover:bg-slate-800 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5"
            >
              🏆 View Scoreboard
            </Link>
            <Link
              to="/citizen/raise"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Raise New Complaint
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-xs text-slate-400 font-medium block mb-1">Total Submitted</span>
            <span className="text-2xl font-extrabold text-white font-mono">{complaints.length}</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30">
            <span className="text-xs text-emerald-300 font-medium block mb-1">Citizens Impacted</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {complaints.reduce((acc, c) => acc + c.affected_citizens_count, 0)}
            </span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-red-500/30">
            <span className="text-xs text-red-300 font-medium block mb-1">Emergencies</span>
            <span className="text-2xl font-extrabold text-red-400 font-mono">
              {complaints.filter(c => c.priority === 'Emergency').length}
            </span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/30">
            <span className="text-xs text-amber-300 font-medium block mb-1">In Progress</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {complaints.filter(c => c.status === 'In Progress' || c.status === 'Pending').length}
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, keyword, summary..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading complaints...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
            <Headphones className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Complaints Found</h4>
            <p className="text-xs text-slate-400">Raise a new call complaint to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <Link
                key={c.id}
                to={`/citizen/complaint/${c.id}`}
                className="block p-5 rounded-2xl glass-panel glass-card-hover border border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-indigo-400 font-bold">{c.tracking_number}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.priority === 'Emergency' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {c.priority}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{c.category}</span>
                      
                      {/* Community Impact Pill */}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" /> {c.affected_citizens_count} Affected
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{c.summary}</h4>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {c.location}</span>
                      <span>Department: <strong className="text-slate-200">{c.department_name}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-block ${
                        c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        c.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {c.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {c.status !== 'Resolved' && (
                      <button
                        onClick={(e) => handleEndorse(e, c.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="I'm Affected"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> 👍
                      </button>
                    )}

                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
