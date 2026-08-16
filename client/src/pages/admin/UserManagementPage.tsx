import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { User as UserType, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  BrainCircuit,
  LayoutDashboard,
  Upload,
  BarChart3,
  History,
  Map,
  BarChart2,
  Bell,
  Settings,
  Search,
  User,
  Users,
  UserCheck,
  Building2
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { showToast } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, dRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/departments')
      ]);

      if (uRes.data.success) setUsers(uRes.data.users || []);
      if (dRes.data.success) setDepartments(dRes.data.departments || []);
    } catch (err) {
      console.error('Failed to load users & departments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, deptId?: string) => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, {
        role: newRole,
        departmentId: deptId
      });

      if (res.data.success) {
        showToast('User Role Updated', `Role changed to ${newRole}`, 'success');
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937]">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          <nav className="space-y-1">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/citizen/raise"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload
            </Link>
            <Link
              to="/scoreboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Scoreboard
            </Link>
            <Link
              to="/admin/logs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <History className="w-4 h-4" /> History
            </Link>
            <Link
              to="/officer/map"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Map className="w-4 h-4" /> Map
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <BarChart2 className="w-4 h-4" /> Analytics
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Hon. Sarah Jenkins'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.department || 'Dept of Public Safety'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">User & Officer Management</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#5E4075] uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" /> Access Control Center
              </div>
              <h2 className="text-xl font-extrabold text-[#1F2937]">System Permission & Personnel Registers</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Assign administrative privileges, allocate departmental roles, and manage system access levels.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#5E4075] border border-purple-200 text-xs font-bold font-mono shrink-0">
              Total Personnel: {users.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="text-xs font-extrabold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#5E4075]" /> Registered Accounts
              </h3>
              <span className="text-[11px] text-[#6B7280]">Showing {filtered.length} entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3.5 px-4">User Name</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4 text-right">Change Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#6B7280]">
                        Loading platform users...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#6B7280]">
                        No user accounts match your search query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#1F2937] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5E4075] font-black flex items-center justify-center border border-purple-100">
                            {u.fullName.charAt(0)}
                          </div>
                          {u.fullName}
                        </td>

                        <td className="py-3.5 px-4 text-[#6B7280] font-mono">{u.email}</td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-50 text-[#5E4075] border-purple-200'
                                : u.role === 'OFFICER'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#1F2937] font-medium">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                            {departments.find((d) => d.id === u.departmentId)?.name || 'General Platform'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="px-3 py-1.5 rounded-xl bg-[#F3F4F6] text-xs font-bold text-[#1F2937] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
                          >
                            <option value="CITIZEN">Role: CITIZEN</option>
                            <option value="OFFICER">Role: OFFICER</option>
                            <option value="ADMIN">Role: ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};