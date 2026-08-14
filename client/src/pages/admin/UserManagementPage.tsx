import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { User, UserRole } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';
import { Users, Search, Shield, UserCheck } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { showToast } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, dRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/departments')
      ]);

      if (uRes.data.success) setUsers(uRes.data.users);
      if (dRes.data.success) setDepartments(dRes.data.departments);
    } catch (err) {
      console.error(err);
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
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-400" /> User & Officer Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage system permissions, officer departments, and administrative roles</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4 text-right">Change Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center">
                        {u.fullName.charAt(0)}
                      </div>
                      {u.fullName}
                    </td>

                    <td className="p-4 text-slate-300 font-mono">{u.email}</td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        u.role === 'OFFICER' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {departments.find(d => d.id === u.departmentId)?.name || 'General Platform'}
                    </td>

                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-3 py-1 rounded-lg glass-input text-xs font-semibold"
                      >
                        <option value="CITIZEN">Role: CITIZEN</option>
                        <option value="OFFICER">Role: OFFICER</option>
                        <option value="ADMIN">Role: ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
