import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Search,
  User,
  ArrowLeft,
  FileText,
  Sparkles,
  MapPin,
  Play,
  Pause,
  ThumbsUp,
  Users,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Feedback State
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const { showToast } = useNotification();

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await apiClient.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.complaint);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async () => {
    if (!complaint) return;
    try {
      const res = await apiClient.post(`/complaints/${complaint.id}/endorse`);
      if (res.data.success) {
        showToast('Endorsed!', 'You are registered as an affected citizen. Complaint priority updated.', 'success');
        setComplaint(res.data.complaint);
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to endorse complaint', 'error');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setSubmittingFeedback(true);
    try {
      const res = await apiClient.post(`/complaints/${complaint.id}/feedback`, {
        rating,
        comment: feedbackComment
      });

      if (res.data.success) {
        showToast('Thank You!', 'Feedback submitted. Department score updated!', 'success');
        setComplaint(res.data.complaint);
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to submit feedback', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#6B7280] font-semibold text-xs">
        Loading complaint details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-base font-extrabold">Complaint Not Found</h2>
        <Link
          to="/citizen/dashboard"
          className="px-4 py-2 rounded-xl bg-[#5E4075] text-white font-extrabold text-xs shadow-xs hover:bg-[#4C3360] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

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

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> My Dashboard
            </Link>
            <Link
              to="/citizen/raise"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Raise New Complaint
            </Link>
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> Complaint History
            </Link>
            <a
              href="#notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </a>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings &amp; Profile
            </Link>
          </nav>
        </div>

        {/* User Card */}
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
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/dashboard"
              className="p-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold text-[#1F2937]">Complaint Details</h1>
              <p className="text-xs text-[#6B7280]">Ticket ID: {complaint.tracking_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-48 sm:w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Live
            </span>

            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* COMPLAINT CONTENT */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* MAIN HEADER CARD */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E7EB] pb-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#5E4075]/10 text-[#5E4075]">
                    {complaint.tracking_number}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                    complaint.priority === 'Emergency'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-[#5E4075]/10 text-[#5E4075]'
                  }`}>
                    {complaint.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-[#6B7280]">{complaint.category}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#1F2937]">{complaint.summary}</h2>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2.5">
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                  complaint.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : complaint.status === 'In Progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-[#5E4075]/10 text-[#5E4075] border border-[#5E4075]/20'
                }`}>
                  {complaint.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {complaint.status === 'In Progress' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                  {complaint.status === 'Open' && <AlertCircle className="w-3.5 h-3.5 text-[#5E4075]" />}
                  {complaint.status}
                </span>

                {complaint.status !== 'Resolved' && (
                  <button
                    onClick={handleEndorse}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Affected ({complaint.affected_citizens_count})
                  </button>
                )}
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-medium block mb-1">Community Impact</span>
                <strong className="text-emerald-600 text-sm font-extrabold flex items-center gap-1">
                  <Users className="w-4 h-4" /> {complaint.affected_citizens_count} Affected Citizens
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-medium block mb-1">Department</span>
                <strong className="text-[#1F2937] text-sm font-extrabold">{complaint.department_name}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-medium block mb-1">Location</span>
                <strong className="text-[#1F2937] text-sm font-extrabold flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#5E4075] shrink-0" /> {complaint.location}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-medium block mb-1">Est. Resolution Time</span>
                <strong className="text-[#1F2937] text-sm font-extrabold">{complaint.estimated_resolution}</strong>
              </div>
            </div>
          </div>

          {/* CITIZEN FEEDBACK & RATING (If Resolved) */}
          {complaint.status === 'Resolved' && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Resolution Quality &amp; Department Rating
              </h3>

              {complaint.feedback_rating ? (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                  <span className="text-[#6B7280] font-medium block">Your Rating:</span>
                  <div className="flex items-center gap-1 text-amber-500 text-base font-extrabold">
                    {'★'.repeat(complaint.feedback_rating)}
                    <span className="text-xs text-[#1F2937] ml-1">({complaint.feedback_rating}/5)</span>
                  </div>
                  {complaint.feedback_comment && (
                    <p className="text-[#1F2937] italic mt-2 text-xs">"{complaint.feedback_comment}"</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-2">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`w-10 h-10 rounded-xl text-sm font-extrabold transition-all ${
                            rating >= s
                              ? 'bg-amber-400 text-white shadow-xs scale-105'
                              : 'bg-[#F3F4F6] text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Leave feedback on department responsiveness..."
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* AUDIO PLAYER & AI SENTIMENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Complaint Player */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5E4075]" /> Audio Complaint Call
              </h3>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white flex items-center justify-center shadow-xs shrink-0 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 h-8 flex items-center gap-1 px-2">
                  {[40, 70, 30, 85, 100, 45, 90, 60, 35, 75, 95, 50, 80].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isPlaying ? 'bg-[#5E4075] animate-pulse' : 'bg-gray-300'
                      }`}
                      style={{ height: `${h * 0.6}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* AI Emotion & Sentiment */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5E4075]" /> AI Emotion &amp; Sentiment
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium block mb-1">Emotion</span>
                  <strong className="text-[#5E4075] text-sm font-extrabold">{complaint.emotion}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium block mb-1">AI Confidence</span>
                  <strong className="text-emerald-600 text-sm font-extrabold">{complaint.confidence}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* VERBATIM TRANSCRIPT */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-3 shadow-xs">
            <h3 className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">
              Speech-to-Text Verbatim Transcript
            </h3>
            <p className="text-[#1F2937] text-xs font-mono leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
              "{complaint.transcript}"
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};