import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { AudioUploader } from '../../components/citizen/AudioUploader';
import { AudioRecorder } from '../../components/citizen/AudioRecorder';

import { useAuth } from '../../contexts/AuthContext';
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
  Layers,
  Users,
  MessageSquareText
} from 'lucide-react';

export const RaiseComplaintPage: React.FC = () => {
  // =====================================================
  // AUTHENTICATED USER
  // =====================================================

  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [activeTab, setActiveTab] =
    useState<'upload' | 'record'>('upload');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [customLocation, setCustomLocation] =
    useState('');

  const [isProcessing, setIsProcessing] =
    useState(false);

  // =====================================================
  // GPS
  // =====================================================

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [gpsStatus, setGpsStatus] =
    useState<
      'idle' |
      'requesting' |
      'success' |
      'unavailable'
    >('idle');

  // =====================================================
  // TRANSCRIPT
  // =====================================================

  const [liveTranscript, setLiveTranscript] =
    useState<string | null>(null);

  // =====================================================
  // RESULT
  // =====================================================

  const [resultData, setResultData] =
    useState<any | null>(null);

  const [wasMerged, setWasMerged] =
    useState(false);

  const [mergeSimilarity, setMergeSimilarity] =
    useState<number>(0);

  const { showToast } =
    useNotification();

  const navigate =
    useNavigate();

  // =====================================================
  // GET CURRENT GPS LOCATION
  // =====================================================

  const getCurrentLocation =
    (): Promise<{
      latitude: number | null;
      longitude: number | null;
    }> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          setGpsStatus('unavailable');

          resolve({
            latitude: null,
            longitude: null
          });

          return;
        }

        setGpsStatus('requesting');

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat =
              position.coords.latitude;

            const lng =
              position.coords.longitude;

            const accuracy =
              position.coords.accuracy;

            console.log(
              '[GPS] Captured:',
              {
                latitude: lat,
                longitude: lng,
                accuracy
              }
            );

            setLatitude(lat);
            setLongitude(lng);
            setGpsStatus('success');

            resolve({
              latitude: lat,
              longitude: lng
            });
          },

          (error) => {
            console.warn(
              '[GPS] Location unavailable:',
              error.message
            );

            setLatitude(null);
            setLongitude(null);
            setGpsStatus('unavailable');

            resolve({
              latitude: null,
              longitude: null
            });
          },

          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      });
    };

  // =====================================================
  // PROCESS AUDIO
  // =====================================================

  const handleProcessAudio =
    async () => {
      if (!selectedFile) {
        showToast(
          'Audio File Required',
          'Please upload or record an audio call before submitting.',
          'warning'
        );

        return;
      }

      setIsProcessing(true);

      try {
        // =================================================
        // 1. GET GPS
        // =================================================

        const gps =
          await getCurrentLocation();

        // =================================================
        // 2. SEND AUDIO
        // =================================================

        const formData =
          new FormData();

        formData.append(
          'audio',
          selectedFile
        );

        const res =
          await apiClient.post(
            '/ai/process-audio',
            formData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data'
              }
            }
          );

        if (!res.data.success) {
          throw new Error(
            res.data.message ||
            'AI processing failed.'
          );
        }

        const {
          transcript,
          englishTranscript,
          analysis,
          audioUrl,
          audioDuration
        } = res.data.data;

        // =================================================
        // 3. TRANSCRIPT
        // =================================================

        setLiveTranscript(
          transcript
        );

        // =================================================
        // 4. FINAL PAYLOAD
        // =================================================

        const payload = {
          transcript,
          englishTranscript,
          analysis,
          audioUrl,
          audioDuration,
          customLocation,
          latitude: gps.latitude,
          longitude: gps.longitude
        };

        console.log(
          '[RaiseComplaint] Final complaint payload:',
          {
            latitude:
              payload.latitude,

            longitude:
              payload.longitude,

            category:
              analysis.category,

            department:
              analysis.department
          }
        );

        // =================================================
        // 5. CREATE / MERGE
        // =================================================

        await finalizeCreate(
          payload
        );

      } catch (err: any) {
        console.error(
          '[RaiseComplaint] Processing failed:',
          err
        );

        showToast(
          'AI Pipeline Error',
          err.response?.data?.message ||
            err.message ||
            'Failed to process audio call.',
          'error'
        );

        setIsProcessing(false);
      }
    };

  // =====================================================
  // CREATE / MERGE
  // =====================================================

  const finalizeCreate =
    async (
      payloadToSave: any
    ) => {
      if (!payloadToSave) {
        showToast(
          'Error',
          'Complaint data is missing.',
          'error'
        );

        return;
      }

      setIsProcessing(true);

      try {
        const saveRes =
          await apiClient.post(
            '/complaints',
            payloadToSave
          );

        if (
          saveRes.data.success
        ) {
          const complaint =
            saveRes.data.complaint;

          const merged =
            saveRes.data.merged === true;

          const similarity =
            Number(
              saveRes.data.similarity || 0
            );

          setResultData(
            complaint
          );

          setWasMerged(
            merged
          );

          setMergeSimilarity(
            similarity
          );

          // =================================================
          // UPDATE GPS
          // =================================================

          if (
            complaint.latitude !== null &&
            complaint.latitude !== undefined
          ) {
            setLatitude(
              complaint.latitude
            );
          }

          if (
            complaint.longitude !== null &&
            complaint.longitude !== undefined
          ) {
            setLongitude(
              complaint.longitude
            );
          }

          // =================================================
          // MESSAGE
          // =================================================

          if (merged) {
            showToast(
              'Complaint Merged',
              `Your complaint was merged with ${complaint.tracking_number}. ${complaint.affected_citizens_count} citizen(s) are affected.`,
              'info'
            );
          } else {
            showToast(
              'Complaint Registered!',
              `Tracking ID: ${complaint.tracking_number}`,
              'success'
            );
          }
        }

      } catch (err: any) {
        console.error(
          '[RaiseComplaint] Complaint creation failed:',
          err
        );

        showToast(
          'Error',
          err.response?.data?.message ||
            'Failed to save complaint',
          'error'
        );

      } finally {
        setIsProcessing(false);
      }
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">

      {/* =================================================
          SIDEBAR
          ================================================= */}

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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Raise New Complaint
            </Link>

            <Link
              to="/citizen/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
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

        {/* DYNAMIC LOGGED-IN CITIZEN */}

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

      {/* =================================================
          MAIN
          ================================================= */}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">

          <div>

            <h1 className="text-lg font-extrabold">
              Audio & Transcript Intake
            </h1>

            <p className="text-xs text-[#6B7280]">
              AI Complaint Intelligence & Community Issue Consolidation
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="relative w-48 sm:w-64 hidden sm:block">

              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />

              <input
                type="text"
                placeholder="Search calls, tickets..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />

            </div>

            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
            </button>

          </div>

        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {!resultData ? (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div className="lg:col-span-7 space-y-6">

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1.5 flex gap-1">

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('upload');
                      setSelectedFile(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 ${
                      activeTab === 'upload'
                        ? 'bg-[#5E4075] text-white'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Audio File
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('record');
                      setSelectedFile(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 ${
                      activeTab === 'record'
                        ? 'bg-[#5E4075] text-white'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                    Record Live Voice Call
                  </button>

                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">

                  {activeTab === 'upload' ? (

                    <AudioUploader
                      onFileSelect={
                        setSelectedFile
                      }
                      selectedFile={
                        selectedFile
                      }
                      onClear={() =>
                        setSelectedFile(null)
                      }
                    />

                  ) : (

                    <AudioRecorder
                      onRecorded={
                        setSelectedFile
                      }
                      recordedFile={
                        selectedFile
                      }
                      onClear={() =>
                        setSelectedFile(null)
                      }
                    />

                  )}

                </div>

                {/* LOCATION */}

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-3">

                  <label className="text-xs font-bold text-[#6B7280] flex items-center gap-2">

                    <MapPin className="w-4 h-4 text-[#5E4075]" />

                    Location / Ward Landmark (Optional)

                  </label>

                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) =>
                      setCustomLocation(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Anna Nagar, Ward 12"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                  />

                  <div className="flex items-center gap-2 text-[11px]">

                    <MapPin
                      className={`w-3.5 h-3.5 ${
                        gpsStatus === 'success'
                          ? 'text-emerald-600'
                          : gpsStatus === 'requesting'
                          ? 'text-amber-500'
                          : 'text-gray-400'
                      }`}
                    />

                    {gpsStatus === 'idle' && (
                      <span className="text-gray-400">
                        Your current GPS location will be detected automatically.
                      </span>
                    )}

                    {gpsStatus === 'requesting' && (
                      <span className="text-amber-600 font-semibold">
                        Detecting your current location...
                      </span>
                    )}

                    {gpsStatus === 'success' && (
                      <span className="text-emerald-600 font-semibold">
                        Current GPS location captured.
                      </span>
                    )}

                    {gpsStatus === 'unavailable' && (
                      <span className="text-gray-400">
                        GPS unavailable. You can still submit.
                      </span>
                    )}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    handleProcessAudio
                  }
                  disabled={
                    !selectedFile ||
                    isProcessing
                  }
                  className="w-full py-3.5 rounded-xl bg-[#5E4075] hover:bg-[#4C3360] text-white font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Processing & Duplicate Detection...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Call & Register Complaint
                    </>
                  )}

                </button>

              </div>

              {/* TRANSCRIPT */}

              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E7EB] p-6 min-h-[480px]">

                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">

                  <h3 className="text-xs font-extrabold uppercase flex items-center gap-2">

                    <MessageSquareText className="w-4 h-4 text-[#5E4075]" />

                    Transcript Output

                  </h3>

                  <span className="text-[10px] text-gray-400">
                    AI Sync
                  </span>

                </div>

                {isProcessing ? (

                  <div className="flex flex-col items-center justify-center py-20">

                    <div className="w-8 h-8 border-3 border-[#5E4075]/20 border-t-[#5E4075] rounded-full animate-spin" />

                    <p className="text-xs text-[#6B7280] mt-3">
                      Analyzing call and checking community issues...
                    </p>

                  </div>

                ) : liveTranscript ? (

                  <div className="space-y-4">

                    <div>

                      <div className="text-[11px] font-extrabold mb-1">
                        Citizen
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F3F4F6] text-xs leading-relaxed">
                        "{liveTranscript}"
                      </div>

                    </div>

                    <div>

                      <div className="text-[11px] font-extrabold text-[#5E4075] mb-1">
                        AI Assistant
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#5E4075]/10 text-xs text-[#5E4075] border border-[#5E4075]/20">
                        Transcript analyzed. Checking whether this is an existing community issue.
                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="flex flex-col items-center justify-center py-20 text-center">

                    <MessageSquareText className="w-8 h-8 text-gray-300 mb-2" />

                    <p className="text-xs font-bold text-gray-400">
                      No transcript yet
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      Upload or record a call and analyze it.
                    </p>

                  </div>

                )}

              </div>

            </div>

          ) : (

            <div
              className={`bg-white rounded-2xl border p-6 space-y-6 ${
                wasMerged
                  ? 'border-amber-300'
                  : 'border-emerald-200'
              }`}
            >

              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 flex-wrap gap-4">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      wasMerged
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >

                    {wasMerged ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}

                  </div>

                  <div>

                    <h3 className="text-base font-extrabold">

                      {wasMerged
                        ? 'Complaint Merged with Existing Community Issue'
                        : 'Complaint Successfully Registered!'}

                    </h3>

                    <span className="text-xs font-mono text-[#5E4075]">

                      Tracking Number:{' '}
                      {resultData.tracking_number}

                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/citizen/dashboard'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#5E4075] text-white font-extrabold text-xs"
                >
                  View in Dashboard
                </button>

              </div>

              {/* MERGE MESSAGE */}

              {wasMerged && (

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">

                  <div className="flex items-start gap-3">

                    <Layers className="w-5 h-5 text-amber-600 mt-0.5" />

                    <div>

                      <p className="text-sm font-extrabold text-amber-800">
                        No duplicate ticket was created.
                      </p>

                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Your complaint was recognized as the same
                        community issue and merged into the existing
                        complaint.
                      </p>

                      {mergeSimilarity > 0 && (
                        <p className="text-[11px] text-amber-600 mt-2 font-semibold">
                          Match confidence: {mergeSimilarity}%
                        </p>
                      )}

                    </div>

                  </div>

                </div>

              )}

              {/* METRICS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                  <span className="text-[#6B7280] block mb-1">
                    Category & Priority
                  </span>

                  <span className="font-extrabold text-sm">
                    {resultData.category}
                  </span>

                  <span className="block mt-1 font-extrabold">
                    {resultData.priority} Priority
                  </span>

                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                  <span className="text-[#6B7280] block mb-1">
                    Assigned Department
                  </span>

                  <span className="font-extrabold text-[#5E4075] text-sm">
                    {resultData.department_name}
                  </span>

                  <span className="text-[#6B7280] block text-[11px] mt-1">
                    Est. Resolution:{' '}
                    {resultData.estimated_resolution}
                  </span>

                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                  <span className="text-[#6B7280] block mb-1">
                    Community Impact
                  </span>

                  <span className="font-extrabold text-emerald-600 text-sm flex items-center gap-1">

                    <Users className="w-4 h-4" />

                    {resultData.affected_citizens_count}
                    {' '}
                    Affected Citizen(s)

                  </span>

                </div>

              </div>

              {/* LOCATION */}

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-3">

                <span className="text-[#6B7280] block font-bold">
                  Real-time Complaint Location
                </span>

                {resultData.latitude !== null &&
                resultData.latitude !== undefined &&
                resultData.longitude !== null &&
                resultData.longitude !== undefined ? (

                  <>

                    <div className="flex items-start gap-2">

                      <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />

                      <div>

                        <span className="text-[11px] text-[#6B7280] block">
                          Location
                        </span>

                        <strong className="text-sm">
                          {resultData.gps_address ||
                            resultData.location ||
                            'Current GPS location'}
                        </strong>

                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB]">

                      <div>

                        <span className="text-[10px] text-[#6B7280] block">
                          Latitude
                        </span>

                        <span className="font-mono font-bold">
                          {Number(
                            resultData.latitude
                          ).toFixed(6)}
                        </span>

                      </div>

                      <div>

                        <span className="text-[10px] text-[#6B7280] block">
                          Longitude
                        </span>

                        <span className="font-mono font-bold">
                          {Number(
                            resultData.longitude
                          ).toFixed(6)}
                        </span>

                      </div>

                    </div>

                  </>

                ) : (

                  <span className="text-gray-400">
                    GPS location was unavailable.
                  </span>

                )}

              </div>

              {/* TRANSCRIPT */}

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">

                <span className="text-[#6B7280] block mb-1 font-bold">
                  Speech-to-Text Verbatim Transcript
                </span>

                <p className="text-[#1F2937] font-mono leading-relaxed bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  "{resultData.transcript}"
                </p>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
};