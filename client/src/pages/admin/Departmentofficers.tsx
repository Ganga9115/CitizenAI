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
  Plus,
  Loader2
} from 'lucide-react';

export interface Officer {
  id: string;
  name: string;
  email: string;
  role: string;
  activeCases: number;
  slaRate: string;
  status: 'Active' | 'On Leave' | 'Busy';
}

export interface DepartmentGroup {
  departmentName: string;
  headName: string;
  officers: Officer[];
}

export const DepartmentOfficers: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentOfficers, setDepartmentOfficers] = useState<DepartmentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentOfficers = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual backend API endpoint
        const response = await fetch('/api/admin/department-officers');
        if (response.ok) {
          const data = await response.json();
          setDepartmentOfficers(data);
        }
      } catch (error) {
        console.error('Failed to fetch department officers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentOfficers();
  }, []);

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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Unique Complaints
            </Link>
            <Link
              to="/admin/officers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
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
            <h1 className="text-lg font-extrabold text-[#1F2937]">Department Officers</h1>
            <p className="text-xs text-[#6B7280]">Manage field officers and dispatch workloads across municipal departments</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-72 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search officers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F3F4F6] text-xs text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#5E4075]"
              />
            </div>
            <button className="px-4 py-2 bg-[#5E4075] hover:bg-[#4d3361] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
              <Plus className="w-4 h-4" /> Add Officer
            </button>
            <button className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-gray-50 transition-colors shrink-0">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-6 w-full mx-auto space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1F2937] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#5E4075]" /> Department Officer Roster
                </h3>
                <p className="text-xs text-[#6B7280]">Active municipal officers categorized under their assigned governance departments.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#6B7280] space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#5E4075]" />
                <p className="text-xs font-medium">Loading department officers...</p>
              </div>
            ) : departmentOfficers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-xl text-[#6B7280]">
                <p className="text-xs font-medium">No department officers found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 w-full">
                {departmentOfficers.map((dept, idx) => {
                  const filteredOfficers = dept.officers?.filter(
                    (o) =>
                      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.role.toLowerCase().includes(searchTerm.toLowerCase())
                  ) || [];

                  return (
                    <div key={idx} className="border border-[#E5E7EB] rounded-xl p-5 bg-[#F8FAFC]">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-[#1F2937]">{dept.departmentName}</h4>
                          <p className="text-[10px] text-[#6B7280]">Head: {dept.headName}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#5E4075]">
                          {dept.officers?.length || 0} Active Personnel
                        </span>
                      </div>

                      <div className="space-y-3">
                        {filteredOfficers.length === 0 ? (
                          <p className="text-[10px] text-[#6B7280] italic text-center py-2">No officers match your search.</p>
                        ) : (
                          filteredOfficers.map((officer) => (
                            <div
                              key={officer.id}
                              className="bg-white p-3.5 rounded-lg border border-[#E5E7EB] flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#5E4075]/10 text-[#5E4075] font-extrabold flex items-center justify-center text-xs shrink-0">
                                  {officer.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </div>
                                <div>
                                  <strong className="text-xs font-bold text-[#1F2937] block">{officer.name}</strong>
                                  <span className="text-[10px] text-[#6B7280]">
                                    {officer.role} • {officer.email}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right space-y-1 shrink-0">
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                    officer.status === 'Active'
                                      ? 'bg-emerald-50 text-emerald-600'
                                      : officer.status === 'Busy'
                                      ? 'bg-amber-50 text-amber-600'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {officer.status}
                                </span>
                                <p className="text-[10px] font-medium text-[#6B7280]">
                                  {officer.activeCases} active cases ({officer.slaRate} SLA)
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
