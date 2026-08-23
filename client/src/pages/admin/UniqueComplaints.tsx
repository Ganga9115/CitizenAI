import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BrainCircuit,
  BarChart2,
  BarChart3,
  FileCheck,
  Users,
  User,
  Search,
  Bell,
  Layers,
  Loader2
} from 'lucide-react';

export interface NonRedundantComplaint {
  id: string;
  trackingId: string;
  category: string;
  department: string;
  duplicateCount: number;
  status: 'In Progress' | 'Dispatched' | 'Pending' | 'Resolved';
  progressPercentage: number;
  assignedOfficer: string;
  lastUpdated: string;
}

export const UniqueComplaints: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState<NonRedundantComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual backend API endpoint
        const response = await fetch('/api/admin/unique-complaints');
        if (response.ok) {
          const data = await response.json();
          setComplaints(data);
        }
      } catch (error) {
        console.error('Failed to fetch unique complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'in_progress'
        ? c.status === 'In Progress' || c.status === 'Dispatched'
        : c.status === 'Resolved';

    const matchesSearch =
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1F2937] w-full">
      {/* LEFT SIDEBAR */}
      <aside className="w-1/5 min-w-[220px] max-w-[280px] bg-[#5E4075] text-white flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">CivicAI</span>
          </Link>

          <nav className="space-y-1.5">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart2 className="w-4 h-4" /> Analytics & Trends
            </Link>
            <Link
              to="/scoreboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Scoreboard
            </Link>
            <Link
              to="/admin/unique-complaints"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Unique Complaints
            </Link>
            <Link
              to="/admin/officers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <Users className="w-4 h-4" /> Department Officers
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Ganga'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.departmentId || 'System Administrator'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10 w-full">
          <div>
            <h1 className="text-lg font-extrabold text-[#1F2937]">Unique Complaints & Progress</h1>
            <p className="text-xs text-[#6B7280]">Deduplicated master complaints with live resolution progress tracking</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-72 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search category, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors shrink-0">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-6 w-full mx-auto space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937] flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#5E4075]" /> Deduplicated Complaints Tracker
                </h3>
                <p className="text-xs text-[#6B7280]">Duplicate complaints are automatically grouped into single actionable master issues.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-xl">
                {(['all', 'in_progress', 'resolved'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-white text-[#5E4075] shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints Progress Table */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#6B7280] space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#5E4075]" />
                <p className="text-xs font-medium">Loading complaints data...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-xl text-[#6B7280]">
                <p className="text-xs font-medium">No complaints found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">Master ID & Category</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Merged Reports</th>
                      <th className="py-3 px-4">Assigned Officer</th>
                      <th className="py-3 px-4">Progress Stage</th>
                      <th className="py-3 px-4 text-right">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredComplaints.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-[#1F2937] block">{item.category}</span>
                          <span className="text-[#6B7280] text-[10px] font-mono">{item.trackingId}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#1F2937]">{item.department}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-[#5E4075] font-extrabold text-[11px]">
                            <Layers className="w-3 h-3" /> {item.duplicateCount} Duplicate Reports
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-[#1F2937]">{item.assignedOfficer}</td>
                        <td className="py-4 px-4 w-[25%] min-w-[180px]">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-[#5E4075]">{item.status}</span>
                              <span className="text-[#6B7280]">{item.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#5E4075] h-full rounded-full transition-all duration-500"
                                style={{ width: `${item.progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-[#6B7280] text-[11px] font-medium">
                          {item.lastUpdated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
