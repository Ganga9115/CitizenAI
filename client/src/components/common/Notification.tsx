import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import {
  BrainCircuit,
  LayoutDashboard,
  PlusCircle,
  Bell,
  Settings,
  User,
  Search,
  CheckCircle2,
  Clock,
  FileCheck,
  UserCheck,
  Wrench,
  ShieldAlert,
  ArrowRight,
  CheckCheck,
  Loader2
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  complaint_id: string;
  tracking_number: string;
  title: string;
  message: string;
  type: 'creation' | 'assignment' | 'status_update' | 'resolution' | 'escalation';
  officer_name?: string;
  department?: string;
  created_at: string;
  is_read: boolean;
}

export const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'updates'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const handleMarkAsRead = async (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return;
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.is_read;
    if (filter === 'updates') return item.type === 'status_update' || item.type === 'resolution';
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'creation':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'assignment':
        return <UserCheck className="w-4 h-4 text-[#5E4075]" />;
      case 'status_update':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'resolution':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'escalation':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR */}
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
              to="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
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
            <h1 className="text-lg font-extrabold text-[#1F2937]">Citizen Notifications</h1>
            <p className="text-xs text-[#6B7280]">Live updates on complaint status and officer actions</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-48 sm:w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>

            <button className="relative w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* HEADER CONTROLS CARD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5E4075]/10 flex items-center justify-center text-[#5E4075] shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#1F2937]">Notification Stream</h2>
                <p className="text-xs text-[#6B7280]">
                  {loading
                    ? 'Loading notifications...'
                    : unreadCount > 0
                    ? `You have ${unreadCount} unread message(s)`
                    : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#5E4075] font-bold text-xs transition-colors shadow-2xs"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read ({unreadCount})
              </button>
            )}
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#5E4075] text-white shadow-xs'
                    : 'bg-white text-[#6B7280] hover:text-[#1F2937] border border-[#E5E7EB]'
                }`}
              >
                All Activity
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  filter === 'unread'
                    ? 'bg-[#5E4075] text-white shadow-xs'
                    : 'bg-white text-[#6B7280] hover:text-[#1F2937] border border-[#E5E7EB]'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter('updates')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'updates'
                    ? 'bg-[#5E4075] text-white shadow-xs'
                    : 'bg-white text-[#6B7280] hover:text-[#1F2937] border border-[#E5E7EB]'
                }`}
              >
                Officer Updates
              </button>
            </div>

            <span className="text-xs text-[#6B7280] font-medium hidden sm:inline">
              Showing {filteredNotifications.length} items
            </span>
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center space-y-3">
                <Loader2 className="w-7 h-7 text-[#5E4075] animate-spin mx-auto" />
                <p className="text-xs font-semibold text-[#6B7280]">Fetching latest updates...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.is_read)}
                  className={`p-5 rounded-2xl border transition-all duration-150 relative bg-white cursor-pointer ${
                    !notif.is_read
                      ? 'border-l-4 border-l-[#5E4075] border-[#E5E7EB] shadow-xs'
                      : 'border-[#E5E7EB] opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          notif.type === 'resolution'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : notif.type === 'status_update'
                            ? 'bg-amber-50 border border-amber-200'
                            : 'bg-[#5E4075]/10 border border-[#5E4075]/20'
                        }`}
                      >
                        {getNotificationIcon(notif.type)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs font-extrabold text-[#1F2937]">{notif.title}</h3>
                          {notif.tracking_number && (
                            <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#5E4075] font-mono text-[10px] font-bold border border-[#E5E7EB]">
                              {notif.tracking_number}
                            </span>
                          )}
                          {!notif.is_read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                        </div>

                        <p className="text-xs text-[#6B7280] leading-relaxed">{notif.message}</p>

                        {/* Meta info bar */}
                        <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2 flex-wrap">
                          {notif.officer_name && (
                            <span>
                              Officer: <strong className="text-[#1F2937]">{notif.officer_name}</strong>
                            </span>
                          )}
                          {notif.department && (
                            <span>
                              Dept: <strong className="text-[#5E4075]">{notif.department}</strong>
                            </span>
                          )}
                          <span className="flex items-center gap-1 font-mono text-gray-400">
                            <Clock className="w-3 h-3" /> {new Date(notif.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Action Link */}
                    {notif.complaint_id && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/citizen/complaint/${notif.complaint_id}`);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-gray-50 hover:bg-white text-[#1F2937] font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center space-y-3">
                <Bell className="w-8 h-8 text-gray-300 mx-auto stroke-[1.5]" />
                <h4 className="text-xs font-bold text-[#1F2937]">No Notifications Found</h4>
                <p className="text-[11px] text-[#6B7280]">
                  You are all caught up! New updates on your raised complaints will appear here in real-time.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};