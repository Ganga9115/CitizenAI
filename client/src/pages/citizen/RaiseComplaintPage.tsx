import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { AudioUploader } from '../../components/citizen/AudioUploader';
import { AudioRecorder } from '../../components/citizen/AudioRecorder';
import { useNotification } from '../../contexts/NotificationContext';
import { apiClient } from '../../services/api';
import { 
  Upload, Mic, MapPin, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, ThumbsUp, Layers, Users 
} from 'lucide-react';

export const RaiseComplaintPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  
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
    setPipelineStep(1); // Groq Transcribing

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);

      const res = await apiClient.post('/ai/process-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPipelineStep(2); // Gemini Analysis

      if (res.data.success) {
        const { transcript, analysis, audioUrl, audioDuration } = res.data.data;
        const payload = { transcript, analysis, audioUrl, audioDuration, customLocation };
        setPendingPayload(payload);

        // STEP 3: AI Semantic Similarity Check
        const simRes = await apiClient.post('/complaints/check-similar', {
          transcript,
          category: analysis.category,
          location: customLocation || analysis.location
        });

        if (simRes.data.success && simRes.data.found) {
          setSimilarMatch(simRes.data);
          setIsProcessing(false);
          setPipelineStep(0);
          showToast('Similar Complaint Found!', `Match score: ${simRes.data.similarity}%`, 'info');
          return;
        }

        // If no duplicate match, save directly
        await finalizeCreate(payload);
      }
    } catch (err: any) {
      showToast('AI Pipeline Error', err.response?.data?.message || 'Failed to process audio call.', 'error');
      setIsProcessing(false);
      setPipelineStep(0);
    }
  };

  const finalizeCreate = async (payloadToSave = pendingPayload) => {
    setIsProcessing(true);
    setPipelineStep(3); // Database Sync

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
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Semantic Similarity + "I'm Affected" Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white">Raise a Citizen Complaint</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload an audio call recording or speak directly into your mic. AI will match existing issues before creation.
          </p>
        </div>

        {/* AI SIMILAR COMPLAINT MATCH MODAL / BANNER */}
        {similarMatch && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-2xl mb-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    ⚠️ Similar Active Issue Found ({similarMatch.similarity}% Match)
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">An existing complaint matches your report!</h3>
                </div>
              </div>
            </div>

            {/* Matched Complaint Details Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-indigo-400">{similarMatch.similarComplaint.tracking_number}</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase">
                  {similarMatch.similarComplaint.priority} Priority
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{similarMatch.similarComplaint.summary}</h4>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Users className="w-4 h-4" /> {similarMatch.similarComplaint.affected_citizens_count} Citizens Affected
                </span>
                <span>Location: <strong className="text-white">{similarMatch.similarComplaint.location}</strong></span>
                <span>Status: <strong className="text-indigo-300">{similarMatch.similarComplaint.status}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleImAffected(similarMatch.similarComplaint.id)}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" /> 👍 I'm Affected by this issue! (Endorse)
              </button>

              <button
                type="button"
                onClick={() => finalizeCreate()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-white/10"
              >
                Create New Independent Ticket
              </button>
            </div>
          </div>
        )}

        {!resultData && !similarMatch ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex rounded-2xl glass-panel p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => { setActiveTab('upload'); setSelectedFile(null); }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" /> Upload Audio File
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('record'); setSelectedFile(null); }}
                  className={`flex-1 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'record' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-4 h-4 text-emerald-400" /> Record Live Voice Call
                </button>
              </div>

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

              <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" /> Location / Ward Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Anna Nagar 4th Street, Ward 12"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleProcessAudio}
                disabled={!selectedFile || isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/25 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI Similarity & Intelligence Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" /> Analyze Call & Check Similar Issues
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Intelligence Workflow
                </h4>

                <div className="space-y-4">
                  {[
                    { step: 1, label: "Groq Whisper STT", desc: "Speech-to-text audio transcription" },
                    { step: 2, label: "Gemini 2.5 Analysis", desc: "Structured JSON & Emotion detection" },
                    { step: 3, label: "Semantic Similarity", desc: "Checks existing issues for 'I'm Affected'" }
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        pipelineStep >= s.step
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-white/10'
                      }`}>
                        {pipelineStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                      <div>
                        <h5 className={`text-xs font-semibold ${pipelineStep >= s.step ? 'text-white' : 'text-slate-500'}`}>
                          {s.label}
                        </h5>
                        <p className="text-[11px] text-slate-400">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : resultData ? (
          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/40 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Complaint Successfully Registered!</h3>
                  <span className="text-xs font-mono text-indigo-300">Tracking Number: {resultData.tracking_number}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/citizen/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                View in Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-400 block mb-1">Category & Priority</span>
                <span className="font-bold text-white text-sm">{resultData.category}</span>
                <span className={`block mt-1 text-[11px] font-bold ${
                  resultData.priority === 'Emergency' ? 'text-red-400' : 'text-amber-400'
                }`}>{resultData.priority} Priority</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-400 block mb-1">Assigned Department</span>
                <span className="font-bold text-indigo-300 text-sm">{resultData.department_name}</span>
                <span className="text-slate-400 block text-[11px] mt-1">Est. Resolution: {resultData.estimated_resolution}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-400 block mb-1">Community Impact</span>
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" /> {resultData.affected_citizens_count} Affected Citizen(s)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1 font-semibold">Groq Whisper Verbatim Transcript</span>
              <p className="text-slate-200 italic font-mono leading-relaxed bg-slate-950/60 p-3 rounded-xl">
                "{resultData.transcript}"
              </p>
            </div>
          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
};
