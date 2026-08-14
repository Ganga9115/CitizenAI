import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { Complaint } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  ArrowLeft, FileText, Sparkles, MapPin, Clock, Shield, AlertTriangle, CheckCircle2, User, Play, Pause, ThumbsUp, Users, Star 
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
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        Loading complaint details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Complaint Not Found</h2>
        <Link to="/citizen/dashboard" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link to="/citizen/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        {/* Complaint Header Card */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm font-bold text-indigo-400">{complaint.tracking_number}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  complaint.priority === 'Emergency' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                }`}>
                  {complaint.priority} Priority
                </span>
                <span className="text-xs text-slate-400">{complaint.category}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{complaint.summary}</h1>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`px-4 py-1.5 rounded-xl text-xs font-extrabold inline-block ${
                complaint.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                complaint.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {complaint.status}
              </span>

              {/* Endorse Button */}
              {complaint.status !== 'Resolved' && (
                <button
                  onClick={handleEndorse}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> 👍 I'm Affected ({complaint.affected_citizens_count})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Community Impact</span>
              <strong className="text-emerald-400 text-sm flex items-center gap-1">
                <Users className="w-4 h-4" /> {complaint.affected_citizens_count} Affected Citizens
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Department</span>
              <strong className="text-white text-sm">{complaint.department_name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Location</span>
              <strong className="text-white text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {complaint.location}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Est. Resolution Time</span>
              <strong className="text-white text-sm">{complaint.estimated_resolution}</strong>
            </div>
          </div>
        </div>

        {/* CITIZEN FEEDBACK & RATING MODAL (If Resolved) */}
        {complaint.status === 'Resolved' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-4 mb-8">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Rate Resolution Quality & Department Performance
            </h4>

            {complaint.feedback_rating ? (
              <div className="p-4 rounded-2xl bg-slate-950/60 text-xs space-y-1">
                <span className="text-slate-400 block">Your Rating:</span>
                <div className="flex items-center gap-1 text-amber-400 text-base font-bold">
                  {'⭐'.repeat(complaint.feedback_rating)} ({complaint.feedback_rating}/5)
                </div>
                {complaint.feedback_comment && (
                  <p className="text-slate-200 italic mt-1">"{complaint.feedback_comment}"</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`w-10 h-10 rounded-xl text-lg font-bold transition-all ${
                          rating >= s ? 'bg-amber-500 text-slate-950 scale-105' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Leave feedback on department responsiveness..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Audio Player & Verbatim Transcript */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Audio Complaint Call
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 h-8 flex items-center gap-1 px-2">
                {[40, 70, 30, 85, 100, 45, 90, 60, 35, 75, 95, 50, 80].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}
                    style={{ height: `${h * 0.6}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Emotion & Sentiment
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">Emotion</span>
                <strong className="text-purple-300 text-sm">{complaint.emotion}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">AI Confidence</span>
                <strong className="text-emerald-400 text-sm">{complaint.confidence}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Verbatim Transcript */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3 mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Groq Whisper Speech-to-Text Verbatim Transcript
          </h4>
          <p className="text-slate-200 text-sm italic font-mono leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-white/5">
            "{complaint.transcript}"
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
};
