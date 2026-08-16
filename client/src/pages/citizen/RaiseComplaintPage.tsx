import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AudioUploader } from '../../components/citizen/AudioUploader';
import { AudioRecorder } from '../../components/citizen/AudioRecorder';
import { useNotification } from '../../contexts/NotificationContext';
import { apiClient } from '../../services/api';
import {
  BrainCircuit,
  LayoutDashboard,
  PlusCircle,
  History,
  Bell,
  Settings,
  Search,
  User,
  Upload,
  Mic,
  MapPin,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  Layers,
  Users,
  MessageSquareText
} from 'lucide-react';

export const RaiseComplaintPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Transcript state for right-side display
  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);

  // Semantic similarity state
  const [similarMatch, setSimilarMatch] = useState<any | null>(null);
  const [pendingPayload, setPendingPayload] = useState<any | null>(null);

  const [resultData, setResultData] = useState<any | null>(null);

  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleProcessAudio = async () => {
    if (!selectedFile) {
      showToast('Audio File Required', 'Please upload or record an audio call before submitting.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);

      const res = await apiClient.post('/ai/process-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const { transcript, analysis, audioUrl, audioDuration } = res.data.data;
        const payload = { transcript, analysis, audioUrl, audioDuration, customLocation };
        
        // Save transcript for display
        setLiveTranscript(transcript);
        setPendingPayload(payload);

        // AI Semantic Similarity Check
        const simRes = await apiClient.post('/complaints/check-similar', {
          transcript,
          category: analysis.category,
          location: customLocation || analysis.location
        });

        if (simRes.data.success && simRes.data.found) {
          setSimilarMatch(simRes.data);
          setIsProcessing(false);
          showToast('Similar Complaint Found!', `Match score: ${simRes.data.similarity}%`, 'info');
          return;
        }

        // If no duplicate match, save directly
        await finalizeCreate(payload);
      }
    } catch (err: any) {
      showToast('AI Pipeline Error', err.response?.data?.message || 'Failed to process audio call.', 'error');
      setIsProcessing(false);
    }
  };

  const finalizeCreate = async (payloadToSave = pendingPayload) => {
    setIsProcessing(true);

    try {
      const saveRes = await apiClient.post('/complaints', payloadToSave);
      if (saveRes.data.success) {
        setResultData(saveRes.data.complaint);
        setSimilarMatch(null);
        showToast('Complaint Registered!', `Tracking ID: ${saveRes.data.complaint.tracking_number}`, 'success');
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to save complaint', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImAffected = async (complaintId: string) => {
    try {
      const res = await apiClient.post(`/complaints/${complaintId}/endorse`);
      if (res.data.success) {
        showToast('Endorsed!', 'You are registered as an affected citizen. Complaint priority updated.', 'success');
        navigate(`/citizen/complaint/${complaintId}`);
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to endorse complaint', 'error');
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Raise New Complaint
            </Link>
            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
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
          <div>
            <h1 className="text-lg font-extrabold text-[#1F2937]">Audio &amp; Transcript Intake</h1>
            <p className="text-xs text-[#6B7280]">AI Semantic Similarity &amp; Instant Verification Engine</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-48 sm:w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search calls, tickets, insights..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* AI SIMILAR COMPLAINT MATCH BANNER */}
          {similarMatch && (
            <div className="bg-white rounded-2xl border border-amber-300 p-6 space-y-6 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-[11px] border border-amber-200">
                      ⚠️ Similar Active Issue Found ({similarMatch.similarity}% Match)
                    </div>
                    <h3 className="text-base font-extrabold text-[#1F2937] mt-1">An existing complaint matches your report!</h3>
                  </div>
                </div>
              </div>

              {/* Matched Complaint Details Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#5E4075]">{similarMatch.similarComplaint.tracking_number}</span>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-extrabold text-[10px] uppercase border border-red-200">
                    {similarMatch.similarComplaint.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-[#1F2937]">{similarMatch.similarComplaint.summary}</h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <Users className="w-4 h-4" /> {similarMatch.similarComplaint.affected_citizens_count} Citizens Affected
                  </span>
                  <span>Location: <strong className="text-[#1F2937]">{similarMatch.similarComplaint.location}</strong></span>
                  <span>Status: <strong className="text-[#5E4075]">{similarMatch.similarComplaint.status}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleImAffected(similarMatch.similarComplaint.id)}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" /> 👍 I'm Affected by this issue! (Endorse)
                </button>

                <button
                  type="button"
                  onClick={() => finalizeCreate()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#6B7280] hover:text-[#1F2937] font-bold text-xs transition-colors"
                >
                  Create New Independent Ticket
                </button>
              </div>
            </div>
          )}

          {!resultData && !similarMatch ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT FORM SECTION (8 COLS) */}
              <div className="lg:col-span-7 space-y-6">

                {/* Input Method Switcher */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1.5 flex gap-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('upload'); setSelectedFile(null); }}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'upload'
                        ? 'bg-[#5E4075] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Upload Audio File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('record'); setSelectedFile(null); }}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'record'
                        ? 'bg-[#5E4075] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-emerald-400" /> Record Live Voice Call
                  </button>
                </div>

                {/* Audio Uploader or Recorder Container */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
                  {activeTab === 'upload' ? (
                    <AudioUploader
                      onFileSelect={(file) => setSelectedFile(file)}
                      selectedFile={selectedFile}
                      onClear={() => setSelectedFile(null)}
                    />
                  ) : (
                    <AudioRecorder
                      onRecorded={(file) => setSelectedFile(file)}
                      recordedFile={selectedFile}
                      onClear={() => setSelectedFile(null)}
                    />
                  )}
                </div>

                {/* Location Input */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-3 shadow-xs">
                  <label className="block text-xs font-bold text-[#6B7280] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#5E4075]" /> Location / Ward Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="e.g. Madison Ave &amp; 4th St Intersection"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="button"
                  onClick={handleProcessAudio}
                  disabled={!selectedFile || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing AI Analysis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Analyze Call &amp; Generate Transcript
                    </>
                  )}
                </button>
              </div>

              {/* RIGHT SIDEBAR: REAL-TIME TRANSCRIPT OUTPUT (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6 min-h-[480px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                    <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                      <MessageSquareText className="w-4 h-4 text-[#5E4075]" /> Real-Time Transcript Output
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
                  </div>

                  {/* Transcript Content Box */}
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-8 h-8 border-3 border-[#5E4075]/20 border-t-[#5E4075] rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-[#6B7280]">Transcribing audio call...</p>
                    </div>
                  ) : liveTranscript ? (
                    <div className="space-y-4">
                      {/* Citizen Bubble */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-[#1F2937]">Citizen (Call)</span>
                          <span className="text-[#6B7280] font-mono">00:12</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] font-medium leading-relaxed">
                          "{liveTranscript}"
                        </div>
                      </div>

                      {/* AI Assistant Confirmation Bubble */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-[#5E4075]">AI Assistant</span>
                          <span className="text-[#6B7280] font-mono">00:25</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#5E4075]/10 text-xs text-[#5E4075] font-semibold leading-relaxed border border-[#5E4075]/20">
                          Got it. I am logging this transcript and parsing categories, locations, and priority scores.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-[#6B7280]">
                      <MessageSquareText className="w-8 h-8 text-gray-300 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-bold text-gray-400">No audio transcript yet</p>
                      <p className="text-[11px] text-gray-400 mt-1">Upload or record a call and click analyze to view real-time text output here.</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleProcessAudio}
                  disabled={!selectedFile || isProcessing}
                  className="w-full py-3 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Process AI Analysis
                </button>
              </div>

            </div>
          ) : resultData ? (
            /* SUCCESS REGISTRATION PANEL */
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-6 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F2937]">Complaint Successfully Registered!</h3>
                    <span className="text-xs font-mono text-[#5E4075]">Tracking Number: {resultData.tracking_number}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/citizen/dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white font-extrabold text-xs transition-colors"
                >
                  View in Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium block mb-1">Category &amp; Priority</span>
                  <span className="font-extrabold text-[#1F2937] text-sm">{resultData.category}</span>
                  <span className={`block mt-1 text-[11px] font-extrabold ${
                    resultData.priority === 'Emergency' ? 'text-red-600' : 'text-amber-600'
                  }`}>{resultData.priority} Priority</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium block mb-1">Assigned Department</span>
                  <span className="font-extrabold text-[#5E4075] text-sm">{resultData.department_name}</span>
                  <span className="text-[#6B7280] block text-[11px] mt-1">Est. Resolution: {resultData.estimated_resolution}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium block mb-1">Community Impact</span>
                  <span className="font-extrabold text-emerald-600 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" /> {resultData.affected_citizens_count} Affected Citizen(s)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
                <span className="text-[#6B7280] block mb-1 font-bold">Speech-to-Text Verbatim Transcript</span>
                <p className="text-[#1F2937] font-mono leading-relaxed bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  "{resultData.transcript}"
                </p>
              </div>
            </div>
          ) : null}

        </main>
      </div>
    </div>
  );
};