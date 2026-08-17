import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { apiClient } from '../../services/api';

import {
  Complaint,
  ComplaintStatus
} from '../../types';

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
  MessageSquare,
  MapPin,
  Navigation
} from 'lucide-react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import L from 'leaflet';

// import 'leaflet/dist/leaflet.css';

// =========================================================
// EXTENDED COMPLAINT TYPE FOR GPS
// =========================================================

type ComplaintWithGPS = Complaint & {
  latitude?: number | null;
  longitude?: number | null;
  gps_address?: string | null;
  notes?: Array<{
    id: string;
    author_name: string;
    note: string;
    created_at: string;
  }>;
};

// =========================================================
// MAP ICON
// =========================================================

const createComplaintIcon = (
  priority: string
) => {
  let color = '#5E4075';

  if (
    priority === 'Emergency' ||
    priority === 'Critical'
  ) {
    color = '#ef4444';
  } else if (
    priority === 'High'
  ) {
    color = '#f97316';
  } else if (
    priority === 'Medium'
  ) {
    color = '#eab308';
  }

  return L.divIcon({
    className: 'civicai-complaint-marker',

    html: `
      <div
        style="
          width:18px;
          height:18px;
          background:${color};
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 12px ${color};
        "
      ></div>
    `,

    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [complaints, setComplaints] =
    useState<ComplaintWithGPS[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintWithGPS | null>(null);

  const [search, setSearch] =
    useState('');

  const [queueTab, setQueueTab] =
    useState<'active' | 'overdue'>('active');

  const [noteText, setNoteText] =
    useState('');

  const [submittingNote, setSubmittingNote] =
    useState(false);

  // =====================================================
  // FETCH COMPLAINTS
  // =====================================================

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);

      console.log(
        '[OfficerDashboard] Fetching department complaints...'
      );

      const res =
        await apiClient.get('/complaints');

      if (res.data.success) {
        setComplaints(
          res.data.complaints || []
        );
      }
    } catch (err: any) {
      console.error(
        '[OfficerDashboard] Failed to fetch complaints:',
        err
      );

      showToast(
        'Failed to Load Queue',
        err.response?.data?.message ||
          'Could not load department complaints.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleUpdateStatus = async (
    id: string,
    newStatus: ComplaintStatus
  ) => {
    try {
      const res =
        await apiClient.patch(
          `/complaints/${id}/status`,
          {
            status: newStatus
          }
        );

      if (res.data.success) {
        showToast(
          'Status Updated',
          `Complaint status set to ${newStatus}`,
          'success'
        );

        setComplaints((previous) =>
          previous.map((complaint) =>
            complaint.id === id
              ? {
                  ...complaint,
                  status: newStatus
                }
              : complaint
          )
        );

        if (
          selectedComplaint?.id === id
        ) {
          setSelectedComplaint(
            (previous) =>
              previous
                ? {
                    ...previous,
                    status: newStatus
                  }
                : null
          );
        }
      }
    } catch (err: any) {
      showToast(
        'Update Failed',
        err.response?.data?.message ||
          'Could not update status',
        'error'
      );
    }
  };

  // =====================================================
  // ADD NOTE
  // =====================================================

  const handleAddNote = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !selectedComplaint ||
      !noteText.trim()
    ) {
      return;
    }

    setSubmittingNote(true);

    try {
      const res =
        await apiClient.post(
          `/complaints/${selectedComplaint.id}/notes`,
          {
            note: noteText
          }
        );

      if (res.data.success) {
        showToast(
          'Note Added',
          'Field note logged',
          'success'
        );

        const detailRes =
          await apiClient.get(
            `/complaints/${selectedComplaint.id}`
          );

        if (
          detailRes.data.success
        ) {
          setSelectedComplaint(
            detailRes.data.complaint as ComplaintWithGPS
          );
        }

        setNoteText('');
      }
    } catch (err: any) {
      showToast(
        'Error',
        err.response?.data?.message ||
          'Failed to add note',
        'error'
      );
    } finally {
      setSubmittingNote(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const departmentComplaints =
    complaints.filter(
      (complaint) => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          complaint.tracking_number
            ?.toLowerCase()
            .includes(query) ||

          complaint.summary
            ?.toLowerCase()
            .includes(query) ||

          complaint.location
            ?.toLowerCase()
            .includes(query) ||

          complaint.category
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  // =====================================================
  // METRICS
  // =====================================================

  const assignedToDeptCount =
    departmentComplaints.length;

  const pendingReviewCount =
    departmentComplaints.filter(
      (complaint) =>
        complaint.status === 'Pending'
    ).length;

  const inProgressCount =
    departmentComplaints.filter(
      (complaint) =>
        complaint.status === 'In Progress' ||
        complaint.status === 'Assigned'
    ).length;

  const resolvedCount =
    departmentComplaints.filter(
      (complaint) =>
        complaint.status === 'Resolved'
    ).length;

  // =====================================================
  // OPEN COMPLAINT
  // =====================================================

  const openComplaint = async (
    complaint: ComplaintWithGPS
  ) => {
    try {
      const res =
        await apiClient.get(
          `/complaints/${complaint.id}`
        );

      if (res.data.success) {
        setSelectedComplaint(
          res.data.complaint as ComplaintWithGPS
        );
      } else {
        setSelectedComplaint(
          complaint
        );
      }
    } catch {
      setSelectedComplaint(
        complaint
      );
    }
  };

  // =====================================================
  // RENDER
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
              to="/officer/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              to="/officer/analysis"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <BarChart3 className="w-4 h-4" />
              Analysis
            </Link>

            <Link
              to="/officer/history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <History className="w-4 h-4" />
              History
            </Link>

            <Link
              to="/officer/map"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs"
            >
              <MapIcon className="w-4 h-4" />
              Live Map
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
              Settings
            </Link>

          </nav>

        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <div className="overflow-hidden">

            <h4 className="text-xs font-bold truncate">
              {user?.fullName || 'Officer'}
            </h4>

            <p className="text-[10px] text-white/70 truncate">
              {user?.departmentId || 'Department Officer'}
            </p>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* TOP BAR */}

        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">

          <h1 className="text-lg font-extrabold">
            Operational Performance Diagnostics
          </h1>

          <div className="flex items-center gap-4">

            <div className="relative w-64 hidden sm:block">

              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search complaints or ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />

            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">

              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              System Live

            </div>

            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280]"
            >
              <Bell className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* BODY */}

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">
                  Assigned to Dept
                </span>
                <Folder className="w-4 h-4 text-[#5E4075]" />
              </div>

              <div className="text-3xl font-black">
                {assignedToDeptCount} Cases
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">
                  Pending Review
                </span>
                <Clock className="w-4 h-4 text-[#5E4075]" />
              </div>

              <div className="text-3xl font-black">
                {pendingReviewCount} Review
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">
                  In Progress
                </span>
                <Clock className="w-4 h-4 text-[#5E4075]" />
              </div>

              <div className="text-3xl font-black">
                {inProgressCount} Active
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#6B7280]">
                  Resolved
                </span>
                <Check className="w-4 h-4 text-[#5E4075]" />
              </div>

              <div className="text-3xl font-black">
                {resolvedCount} Done
              </div>
            </div>

          </div>

          {/* QUEUE */}

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-base font-extrabold">
                  SLA Investigation Queue
                </h2>

                <p className="text-xs text-[#6B7280] mt-0.5">
                  Showing tickets assigned to your department.
                </p>

              </div>

              <div className="bg-[#F3F4F6] p-1 rounded-xl flex items-center text-xs font-bold">

                <button
                  type="button"
                  onClick={() =>
                    setQueueTab('active')
                  }
                  className={`px-3 py-1 rounded-lg ${
                    queueTab === 'active'
                      ? 'bg-[#5E4075] text-white'
                      : 'text-[#6B7280]'
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setQueueTab('overdue')
                  }
                  className={`px-3 py-1 rounded-lg ${
                    queueTab === 'overdue'
                      ? 'bg-[#5E4075] text-white'
                      : 'text-[#6B7280]'
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
                    <th className="py-3 px-4">
                      Case ID
                    </th>

                    <th className="py-3 px-4">
                      Issue Summary
                    </th>

                    <th className="py-3 px-4">
                      Location
                    </th>

                    <th className="py-3 px-4">
                      Priority
                    </th>

                    <th className="py-3 px-4">
                      Status
                    </th>

                    <th className="py-3 px-4 text-right">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-[#E5E7EB]">

                  {loading ? (

                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-[#6B7280]"
                      >
                        Fetching department complaints queue...
                      </td>
                    </tr>

                  ) : departmentComplaints.length > 0 ? (

                    departmentComplaints.map(
                      (complaint) => (

                        <tr
                          key={complaint.id}
                          className="hover:bg-gray-50/80"
                        >

                          <td className="py-3.5 px-4 font-bold text-[#5E4075] font-mono">
                            {complaint.tracking_number}
                          </td>

                          <td className="py-3.5 px-4 font-medium max-w-xs truncate">
                            {complaint.summary ||
                              complaint.category}
                          </td>

                          <td className="py-3.5 px-4 text-[#6B7280] max-w-[180px] truncate">
                            {complaint.location || 'N/A'}
                          </td>

                          <td className="py-3.5 px-4">

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                                complaint.priority ===
                                  'Emergency'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}
                            >
                              {complaint.priority || 'Medium'}
                            </span>

                          </td>

                          <td className="py-3.5 px-4">

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                complaint.status ===
                                'Resolved'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : complaint.status ===
                                    'Pending'
                                  ? 'bg-purple-50 text-purple-600'
                                  : 'bg-blue-50 text-blue-600'
                              }`}
                            >
                              {complaint.status}
                            </span>

                          </td>

                          <td className="py-3.5 px-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                openComplaint(
                                  complaint
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#5E4075]/10 hover:bg-[#5E4075] text-[#5E4075] hover:text-white font-bold text-xs"
                            >
                              Inspect
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-[#6B7280]"
                      >
                        No complaints currently assigned to your department.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

      {/* =================================================
          INSPECTION DRAWER
          ================================================= */}

      {selectedComplaint && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">

          <div className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 space-y-6 border-l border-[#E5E7EB] shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">

              <div>

                <span className="font-mono text-xs font-bold text-[#5E4075]">
                  {selectedComplaint.tracking_number}
                </span>

                <h3 className="text-lg font-extrabold">
                  Case Deep Inspection
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedComplaint(null)
                }
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* LOCATION */}

            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-4 space-y-4">

              <div className="flex items-center gap-2">

                <MapPin className="w-5 h-5 text-[#5E4075]" />

                <div>

                  <h4 className="text-sm font-extrabold">
                    Complaint Location
                  </h4>

                  <p className="text-[11px] text-[#6B7280]">
                    Captured from complaint GPS
                  </p>

                </div>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">
                  Address
                </p>

                <p className="text-sm font-bold text-[#1F2937] mt-1">

                  {selectedComplaint.location ||
                    selectedComplaint.gps_address ||
                    'Location not specified'}

                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-3">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">
                    Latitude
                  </p>

                  <p className="text-xs font-mono font-bold text-[#5E4075] mt-1">

                    {selectedComplaint.latitude ??
                      'Not available'}

                  </p>

                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-3">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#6B7280]">
                    Longitude
                  </p>

                  <p className="text-xs font-mono font-bold text-[#5E4075] mt-1">

                    {selectedComplaint.longitude ??
                      'Not available'}

                  </p>

                </div>

              </div>

            </div>

            {/* MAP */}

            {typeof selectedComplaint.latitude ===
              'number' &&
            typeof selectedComplaint.longitude ===
              'number' ? (

              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <h4 className="text-xs font-extrabold flex items-center gap-2">

                    <Navigation className="w-4 h-4 text-[#5E4075]" />

                    Complaint GPS Map

                  </h4>

                  <span className="text-[10px] text-emerald-600 font-bold">
                    Live Coordinates
                  </span>

                </div>

                <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-[#E5E7EB]">

                  <MapContainer
                    center={[
                      selectedComplaint.latitude,
                      selectedComplaint.longitude
                    ] as [number, number]}
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  >

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    <Marker
                      position={[
                        selectedComplaint.latitude,
                        selectedComplaint.longitude
                      ] as [number, number]}
                      icon={createComplaintIcon(
                        selectedComplaint.priority
                      )}
                    >

                      <Popup>

                        <div className="text-xs space-y-1">

                          <strong>
                            {selectedComplaint.tracking_number}
                          </strong>

                          <p>
                            {selectedComplaint.location ||
                              'GPS location'}
                          </p>

                          <p>
                            Priority:{' '}
                            {selectedComplaint.priority}
                          </p>

                        </div>

                      </Popup>

                    </Marker>

                  </MapContainer>

                </div>

              </div>

            ) : (

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700">
                GPS coordinates are not available for this complaint.
              </div>

            )}

            {/* AI ACTION */}

            <div className="p-4 rounded-xl bg-[#5E4075]/10 border border-[#5E4075]/20 space-y-1">

              <span className="text-xs font-bold text-[#5E4075] flex items-center gap-1.5">

                <Sparkles className="w-4 h-4" />

                AI Recommended Dispatch Action

              </span>

              <p className="text-xs leading-relaxed">

                {selectedComplaint.suggested_action ||
                  'Inspect area and assign field resolution squad.'}

              </p>

            </div>

            {/* STATUS */}

            <div>

              <label className="block text-xs font-bold mb-1.5">
                Update Status
              </label>

              <select
                value={selectedComplaint.status}
                onChange={(e) =>
                  handleUpdateStatus(
                    selectedComplaint.id,
                    e.target
                      .value as ComplaintStatus
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold"
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Assigned">
                  Assigned
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </div>

            {/* TRANSCRIPT */}

            <div>

              <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Speech-To-Text Log
              </label>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs italic font-mono">

                "
                {selectedComplaint.transcript ||
                  selectedComplaint.summary}
                "

              </div>

            </div>

            {/* NOTES */}

            <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">

              <h4 className="text-xs font-extrabold flex items-center gap-1.5">

                <MessageSquare className="w-4 h-4 text-[#5E4075]" />

                Field Notes

              </h4>

              {selectedComplaint.notes &&
              selectedComplaint.notes.length >
                0 ? (

                <div className="space-y-2">

                  {selectedComplaint.notes.map(
                    (note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-gray-50 border border-[#E5E7EB] text-xs"
                      >

                        <div className="flex justify-between text-[#6B7280] mb-1">

                          <strong className="text-[#5E4075]">
                            {note.author_name}
                          </strong>

                          <span>
                            {new Date(
                              note.created_at
                            ).toLocaleTimeString()}
                          </span>

                        </div>

                        <p className="text-[#1F2937]">
                          {note.note}
                        </p>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <p className="text-xs text-[#6B7280] italic">
                  No field notes logged yet.
                </p>

              )}

              <form
                onSubmit={handleAddNote}
                className="space-y-2"
              >

                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) =>
                    setNoteText(
                      e.target.value
                    )
                  }
                  placeholder="Log dispatch note..."
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                />

                <button
                  type="submit"
                  disabled={
                    submittingNote ||
                    !noteText.trim()
                  }
                  className="w-full py-2.5 rounded-xl bg-[#5E4075] hover:bg-[#4a325d] text-white font-bold text-xs disabled:opacity-50"
                >
                  {submittingNote
                    ? 'Saving Note...'
                    : 'Save Internal Note'}
                </button>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};