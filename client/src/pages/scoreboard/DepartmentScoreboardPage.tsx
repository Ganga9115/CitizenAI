import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { DepartmentScoreboardItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  BrainCircuit,
  LayoutDashboard,
  BarChart3,
  History,
  Bell,
  Settings,
  Search,
  User,
  Trophy,
  Star,
  Award,
  TrendingUp,
  ShieldAlert,
  Users,
  FileText
} from 'lucide-react';

export const DepartmentScoreboardPage: React.FC = () => {
  const { user } = useAuth();
  const [scoreboard, setScoreboard] = useState<DepartmentScoreboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScoreboard();
  }, []);

  const fetchScoreboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/scoreboard');
      if (res.data.success) {
        setScoreboard(res.data.scoreboard || []);
      }
    } catch (err) {
      console.error('Failed to fetch scoreboard', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return (
      <span className="w-7 h-7 rounded-full bg-purple-50 text-[#5E4075] font-bold flex items-center justify-center text-xs">
        #{rank}
      </span>
    );
  };

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
              to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/officer/dashboard'}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/scoreboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <Trophy className="w-4 h-4" /> Scoreboard
            </Link>
            {user?.role === 'ADMIN' ? (
              <>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
                >
                  <Users className="w-4 h-4" /> User Management
                </Link>
                <Link
                  to="/admin/logs"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
                >
                  <FileText className="w-4 h-4" /> System Logs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/officer/analysis"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
                >
                  <BarChart3 className="w-4 h-4" /> Analysis
                </Link>
                <Link
                  to="/officer/history"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-xs transition-colors"
                >
                  <History className="w-4 h-4" /> History
                </Link>
              </>
            )}
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
            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Ganga'}</h4>
            <p className="text-[10px] text-white/70 truncate">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg font-extrabold text-[#1F2937]">Department Performance Rankings</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search department ratings..."
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
          {/* BANNER HEADER */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#5E4075] uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4 text-amber-500" /> Administrative Leaderboard
              </div>
              <h2 className="text-xl font-extrabold text-[#1F2937]">Civic Accountability Scoreboard</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Evaluation computed via resolution speed, SLA compliance %, and direct citizen ratings.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#5E4075] border border-purple-200 text-xs font-bold shrink-0">
              Live Real-Time Data
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#6B7280] text-xs font-semibold">
              Loading department performance rankings...
            </div>
          ) : scoreboard.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E5E7EB] text-center text-[#6B7280] text-xs">
              No department ranking data currently available.
            </div>
          ) : (
            <>
              {/* PODIUM TOP 3 */}
              {scoreboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  {/* Rank 2 (Silver) */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs text-center order-2 md:order-1">
                    <div className="text-4xl mb-2">🥈</div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">2nd Rank</span>
                    <h3 className="text-base font-extrabold text-[#1F2937] mt-1">{scoreboard[1].name}</h3>
                    <div className="text-3xl font-black text-[#5E4075] font-mono my-2">
                      {scoreboard[1].overallScore}<span className="text-xs text-[#6B7280]">/100</span>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-semibold text-[#6B7280] pt-3 border-t border-[#E5E7EB]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {scoreboard[1].citizenRating}/5
                      </span>
                      <span>{scoreboard[1].avgResolutionHours}h speed</span>
                    </div>
                  </div>

                  {/* Rank 1 (Gold Winner) */}
                  <div className="bg-[#5E4075] p-6 rounded-2xl text-white text-center shadow-lg shadow-purple-900/20 order-1 md:order-2 border-2 border-amber-400 scale-105">
                    <div className="text-5xl mb-2">🥇</div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300 flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5" /> #1 Performing Department
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">{scoreboard[0].name}</h3>
                    <div className="text-4xl font-black text-amber-300 font-mono my-3">
                      {scoreboard[0].overallScore}<span className="text-xs text-white/70">/100</span>
                    </div>
                    <div className="flex justify-center gap-3 text-xs font-bold text-white/90 pt-3 border-t border-white/20">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> {scoreboard[0].citizenRating}/5
                      </span>
                      <span>{scoreboard[0].slaCompliancePercent}% SLA</span>
                      <span>{scoreboard[0].avgResolutionHours}h speed</span>
                    </div>
                  </div>

                  {/* Rank 3 (Bronze) */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs text-center order-3">
                    <div className="text-4xl mb-2">🥉</div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">3rd Rank</span>
                    <h3 className="text-base font-extrabold text-[#1F2937] mt-1">{scoreboard[2].name}</h3>
                    <div className="text-3xl font-black text-amber-700 font-mono my-2">
                      {scoreboard[2].overallScore}<span className="text-xs text-[#6B7280]">/100</span>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-semibold text-[#6B7280] pt-3 border-t border-[#E5E7EB]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {scoreboard[2].citizenRating}/5
                      </span>
                      <span>{scoreboard[2].avgResolutionHours}h speed</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FULL SCOREBOARD TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1F2937] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5E4075]" /> Full Performance Standings
                  </h3>
                  <span className="text-[11px] text-[#6B7280] font-semibold">
                    Total Departments: {scoreboard.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3.5 px-4">Rank</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Citizen Rating</th>
                        <th className="py-3.5 px-4">Avg Resolution Speed</th>
                        <th className="py-3.5 px-4">SLA Compliance</th>
                        <th className="py-3.5 px-4">Resolution Rate</th>
                        <th className="py-3.5 px-4 text-right">Overall Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {scoreboard.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold">{getRankBadge(item.rank || index + 1)}</td>
                          <td className="py-3.5 px-4">
                            <strong className="text-[#1F2937] font-bold block text-xs">{item.name}</strong>
                            <span className="text-[10px] text-[#6B7280] font-mono">
                              {item.code} • {item.totalComplaints} total complaints
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {item.citizenRating} / 5
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#1F2937] font-semibold">{item.avgResolutionHours} hrs</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                              {item.slaCompliancePercent}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#6B7280] font-medium">
                            {item.resolutionRatePercent}% ({item.resolvedComplaints}/{item.totalComplaints})
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-base font-extrabold text-[#5E4075] font-mono">
                              {item.overallScore}
                            </span>
                            <span className="text-[#6B7280] text-[10px]">/100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};