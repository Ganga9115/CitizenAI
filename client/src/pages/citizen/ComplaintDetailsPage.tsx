import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams,
  Link
} from 'react-router-dom';

import {
  apiClient
} from '../../services/api';

import {
  Complaint
} from '../../types';

import {
  useAuth
} from '../../contexts/AuthContext';

import {
  useNotification
} from '../../contexts/NotificationContext';

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
  AlertCircle,
  Navigation
} from 'lucide-react';

export const ComplaintDetailsPage: React.FC = () => {

  const { id } =
    useParams<{
      id: string
    }>();

  const { user } =
    useAuth();

  const [complaint, setComplaint] =
    useState<Complaint | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [rating, setRating] =
    useState<number>(5);

  const [feedbackComment, setFeedbackComment] =
    useState('');

  const [submittingFeedback, setSubmittingFeedback] =
    useState(false);

  const { showToast } =
    useNotification();

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const fetchDetails =
    async () => {

      try {

        const res =
          await apiClient.get(
            `/complaints/${id}`
          );

        if (
          res.data.success
        ) {

          setComplaint(
            res.data.complaint
          );
        }

      } catch (err) {

        console.error(
          '[ComplaintDetails] Failed to fetch:',
          err
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // ENDORSE
  // =====================================================

  const handleEndorse =
    async () => {

      if (!complaint) {
        return;
      }

      try {

        const res =
          await apiClient.post(
            `/complaints/${complaint.id}/endorse`
          );

        if (
          res.data.success
        ) {

          showToast(
            'Endorsed!',
            'You are registered as an affected citizen. Complaint priority updated.',
            'success'
          );

          setComplaint(
            res.data.complaint
          );
        }

      } catch (err: any) {

        showToast(
          'Error',
          err.response?.data?.message ||
            'Failed to endorse complaint',
          'error'
        );
      }
    };

  // =====================================================
  // FEEDBACK
  // =====================================================

  const handleFeedbackSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (!complaint) {
        return;
      }

      setSubmittingFeedback(true);

      try {

        const res =
          await apiClient.post(
            `/complaints/${complaint.id}/feedback`,
            {
              rating,
              comment:
                feedbackComment
            }
          );

        if (
          res.data.success
        ) {

          showToast(
            'Thank You!',
            'Feedback submitted. Department score updated!',
            'success'
          );

          setComplaint(
            res.data.complaint
          );
        }

      } catch (err: any) {

        showToast(
          'Error',
          err.response?.data?.message ||
            'Failed to submit feedback',
          'error'
        );

      } finally {

        setSubmittingFeedback(
          false
        );
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#6B7280] font-semibold text-xs">
        Loading complaint details...
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!complaint) {

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">

        <h2 className="text-base font-extrabold">
          Complaint Not Found
        </h2>

        <Link
          to="/citizen/dashboard"
          className="px-4 py-2 rounded-xl bg-[#5E4075] text-white font-extrabold text-xs"
        >
          Back to Dashboard
        </Link>

      </div>
    );
  }

  // =====================================================
  // GPS
  // =====================================================

  const hasGps =
    typeof complaint.latitude ===
      'number' &&
    Number.isFinite(
      complaint.latitude
    ) &&
    typeof complaint.longitude ===
      'number' &&
    Number.isFinite(
      complaint.longitude
    );

  const mapUrl =
    hasGps
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${
          complaint.longitude! - 0.01
        }%2C${
          complaint.latitude! - 0.01
        }%2C${
          complaint.longitude! + 0.01
        }%2C${
          complaint.latitude! + 0.01
        }&layer=mapnik&marker=${
          complaint.latitude
        }%2C${
          complaint.longitude
        }`
      : '';

  const openMapUrl =
    hasGps
      ? `https://www.openstreetmap.org/?mlat=${complaint.latitude}&mlon=${complaint.longitude}#map=17/${complaint.latitude}/${complaint.longitude}`
      : '#';

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">

      {/* SIDEBAR */}

      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">

        <div>

          <Link
            to="/"
            className="flex items-center gap-2.5 mb-10"
          >

            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">

              <BrainCircuit className="w-5 h-5" />

            </div>

            <span className="font-extrabold text-xl">
              CivicAI
            </span>

          </Link>

          <nav className="space-y-1">

            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </Link>

            <Link
              to="/citizen/raise"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Raise New Complaint
            </Link>

            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs"
            >
              <History className="w-4 h-4" />
              Complaint History
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <Settings className="w-4 h-4" />
              Settings & Profile
            </Link>

          </nav>
        </div>

        {/* DYNAMIC USER */}

        <Link
          to="/profile"
          className="pt-4 border-t border-white/10 flex items-center gap-3"
        >

          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <div className="overflow-hidden">

            <h4 className="text-xs font-bold truncate">
              {user?.fullName || 'Citizen'}
            </h4>

            <p className="text-[10px] text-white/70 truncate">
              Citizen Account
            </p>

          </div>

        </Link>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <Link
              to="/citizen/dashboard"
              className="p-2 rounded-xl border border-[#E5E7EB]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>

              <h1 className="text-lg font-extrabold">
                Complaint Details
              </h1>

              <p className="text-xs text-[#6B7280]">
                Ticket ID: {complaint.tracking_number}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">

              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              System Live

            </span>

            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
            </button>

          </div>

        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* MAIN CARD */}

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-6">

            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-[#E5E7EB] pb-5">

              <div className="space-y-2">

                <div className="flex items-center gap-2 flex-wrap">

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#5E4075]/10 text-[#5E4075]">
                    {complaint.tracking_number}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#5E4075]/10 text-[#5E4075]">
                    {complaint.priority} Priority
                  </span>

                  <span className="text-xs font-semibold text-[#6B7280]">
                    {complaint.category}
                  </span>

                </div>

                <h2 className="text-xl font-extrabold">
                  {complaint.summary}
                </h2>

              </div>

              <div className="flex flex-col items-start sm:items-end gap-2.5">

                <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#5E4075]/10 text-[#5E4075] flex items-center gap-1.5">

                  {complaint.status === 'Resolved' && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}

                  {complaint.status === 'In Progress' && (
                    <Clock className="w-3.5 h-3.5" />
                  )}

                  {complaint.status !== 'Resolved' &&
                    complaint.status !== 'In Progress' && (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}

                  {complaint.status}

                </span>

                {complaint.status !== 'Resolved' && (

                  <button
                    type="button"
                    onClick={handleEndorse}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5"
                  >

                    <ThumbsUp className="w-3.5 h-3.5" />

                    Affected ({complaint.affected_citizens_count})

                  </button>

                )}

              </div>

            </div>

            {/* METRICS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <span className="text-[#6B7280] block mb-1">
                  Community Impact
                </span>

                <strong className="text-emerald-600 text-sm flex items-center gap-1">

                  <Users className="w-4 h-4" />

                  {complaint.affected_citizens_count}
                  {' '}
                  Affected Citizens

                </strong>

              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <span className="text-[#6B7280] block mb-1">
                  Department
                </span>

                <strong className="text-sm">
                  {complaint.department_name}
                </strong>

              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <span className="text-[#6B7280] block mb-1">
                  Complaint Location
                </span>

                <strong className="text-sm flex items-center gap-1 truncate">

                  <MapPin className="w-3.5 h-3.5 text-[#5E4075]" />

                  {complaint.location}

                </strong>

              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <span className="text-[#6B7280] block mb-1">
                  Est. Resolution Time
                </span>

                <strong className="text-sm">
                  {complaint.estimated_resolution}
                </strong>

              </div>

            </div>

          </div>

          {/* GPS MAP */}

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div>

                <h3 className="text-sm font-extrabold flex items-center gap-2">

                  <Navigation className="w-4 h-4 text-[#5E4075]" />

                  Citizen GPS Location

                </h3>

                <p className="text-[11px] text-[#6B7280] mt-1">
                  Location captured automatically when the complaint was submitted.
                </p>

              </div>

              {hasGps && (

                <a
                  href={openMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5E4075] text-white text-xs font-extrabold"
                >

                  <MapPin className="w-3.5 h-3.5" />

                  Open Full Map

                </a>

              )}

            </div>

            {hasGps ? (

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                <div className="lg:col-span-3">

                  <div className="rounded-2xl overflow-hidden border border-[#E5E7EB]">

                    <iframe
                      title="Complaint GPS Location"
                      src={mapUrl}
                      className="w-full h-[360px] border-0"
                      loading="lazy"
                    />

                  </div>

                </div>

                <div className="space-y-4">

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                    <span className="text-[11px] text-[#6B7280] block mb-1">
                      Latitude
                    </span>

                    <strong className="text-sm font-mono">
                      {Number(
                        complaint.latitude
                      ).toFixed(6)}
                    </strong>

                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                    <span className="text-[11px] text-[#6B7280] block mb-1">
                      Longitude
                    </span>

                    <strong className="text-sm font-mono">
                      {Number(
                        complaint.longitude
                      ).toFixed(6)}
                    </strong>

                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">

                    <div className="flex items-start gap-2">

                      <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />

                      <div>

                        <span className="text-[11px] text-emerald-700 font-bold block">
                          GPS Verified
                        </span>

                        <p className="text-[11px] text-emerald-600 mt-1">
                          Actual device location captured during complaint submission.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <MapPin className="w-5 h-5 text-gray-400" />

                <p className="text-xs font-bold text-[#6B7280] mt-2">
                  GPS location unavailable
                </p>

              </div>

            )}

          </div>

          {/* FEEDBACK */}

          {complaint.status === 'Resolved' && (

            <div className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4">

              <h3 className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">

                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />

                Resolution Quality & Department Rating

              </h3>

              {complaint.feedback_rating ? (

                <div className="p-4 rounded-xl bg-emerald-50/50">

                  <span className="text-xs text-[#6B7280]">
                    Your Rating:
                  </span>

                  <div className="text-amber-500 text-base font-extrabold">

                    {'★'.repeat(
                      complaint.feedback_rating
                    )}

                    <span className="text-xs text-[#1F2937] ml-1">
                      ({complaint.feedback_rating}/5)
                    </span>

                  </div>

                  {complaint.feedback_comment && (

                    <p className="text-xs italic mt-2">
                      "{complaint.feedback_comment}"
                    </p>

                  )}

                </div>

              ) : (

                <form
                  onSubmit={
                    handleFeedbackSubmit
                  }
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-bold mb-2">
                      Rating (1 to 5 Stars)
                    </label>

                    <div className="flex gap-2">

                      {[1, 2, 3, 4, 5].map(
                        (s) => (

                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              setRating(s)
                            }
                            className={`w-10 h-10 rounded-xl ${
                              rating >= s
                                ? 'bg-amber-400 text-white'
                                : 'bg-[#F3F4F6] text-gray-400'
                            }`}
                          >
                            ★
                          </button>

                        )
                      )}

                    </div>

                  </div>

                  <textarea
                    rows={3}
                    value={
                      feedbackComment
                    }
                    onChange={(e) =>
                      setFeedbackComment(
                        e.target.value
                      )
                    }
                    placeholder="Leave feedback..."
                    className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs"
                  />

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs"
                  >
                    {submittingFeedback
                      ? 'Submitting...'
                      : 'Submit Feedback'}
                  </button>

                </form>

              )}

            </div>

          )}

          {/* AUDIO + SENTIMENT */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">

              <h3 className="text-xs font-extrabold uppercase flex items-center gap-2">

                <FileText className="w-4 h-4 text-[#5E4075]" />

                Audio Complaint Call

              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setIsPlaying(
                      !isPlaying
                    )
                  }
                  className="w-10 h-10 rounded-xl bg-[#5E4075] text-white flex items-center justify-center"
                >

                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}

                </button>

              </div>

            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">

              <h3 className="text-xs font-extrabold uppercase flex items-center gap-2">

                <Sparkles className="w-4 h-4 text-[#5E4075]" />

                AI Emotion & Sentiment

              </h3>

              <div className="grid grid-cols-2 gap-3">

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                  <span className="text-[#6B7280] text-xs block mb-1">
                    Emotion
                  </span>

                  <strong className="text-[#5E4075]">
                    {complaint.emotion}
                  </strong>

                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                  <span className="text-[#6B7280] text-xs block mb-1">
                    AI Confidence
                  </span>

                  <strong className="text-emerald-600">
                    {complaint.confidence}%
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* TRANSCRIPT */}

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">

            <h3 className="text-xs font-extrabold uppercase text-[#6B7280] mb-3">
              Speech-to-Text Verbatim Transcript
            </h3>

            <p className="text-xs font-mono bg-[#F8FAFC] p-4 rounded-xl">
              "{complaint.transcript}"
            </p>

          </div>

        </main>

      </div>

    </div>
  );
};