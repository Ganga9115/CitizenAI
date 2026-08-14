import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { DepartmentScoreboardItem } from '../../types';
import { Trophy, Star, Clock, CheckCircle2, ShieldCheck, AlertCircle, Award, TrendingUp } from 'lucide-react';

export const DepartmentScoreboardPage: React.FC = () => {
  const [scoreboard, setScoreboard] = useState<DepartmentScoreboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScoreboard();
  }, []);

  const fetchScoreboard = async () => {
    try {
      const res = await apiClient.get('/analytics/scoreboard');
      if (res.data.success) {
        setScoreboard(res.data.scoreboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xs">#{rank}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-amber-400" /> Civic Accountability & Transparency Scoreboard
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Government Department Performance Scoreboard
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Real-time evaluation based on citizen feedback ratings, average resolution speed, SLA compliance %, and complaint resolution rates.
          </p>
        </div>

        {/* Podium Top 3 Departments */}
        {scoreboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Rank 2 (Silver) */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-400/30 text-center relative overflow-hidden order-2 md:order-1">
              <div className="text-4xl mb-2">🥈</div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">2nd Rank</span>
              <h3 className="text-xl font-bold text-white mt-1">{scoreboard[1].name}</h3>
              <div className="text-3xl font-extrabold text-slate-200 font-mono my-3">{scoreboard[1].overallScore}<span className="text-xs text-slate-400">/100</span></div>
              <div className="flex justify-center gap-4 text-xs text-slate-300 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {scoreboard[1].citizenRating}/5</span>
                <span>{scoreboard[1].avgResolutionHours}h avg speed</span>
              </div>
            </div>

            {/* Rank 1 (Gold Winner) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900/60 via-purple-900/50 to-slate-900/90 border-2 border-amber-400/50 text-center relative overflow-hidden shadow-2xl order-1 md:order-2 scale-105">
              <div className="text-5xl mb-2 animate-bounce">🥇</div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-extrabold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" /> #1 Performing Department
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{scoreboard[0].name}</h3>
              <div className="text-4xl font-extrabold text-amber-400 font-mono my-3">{scoreboard[0].overallScore}<span className="text-xs text-slate-300">/100</span></div>
              <div className="flex justify-center gap-4 text-xs text-white border-t border-amber-500/30 pt-3 font-semibold">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> {scoreboard[0].citizenRating}/5</span>
                <span>{scoreboard[0].slaCompliancePercent}% SLA</span>
                <span>{scoreboard[0].avgResolutionHours}h speed</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="p-6 rounded-3xl glass-panel border border-amber-700/30 text-center relative overflow-hidden order-3">
              <div className="text-4xl mb-2">🥉</div>
              <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold">3rd Rank</span>
              <h3 className="text-xl font-bold text-white mt-1">{scoreboard[2].name}</h3>
              <div className="text-3xl font-extrabold text-amber-500 font-mono my-3">{scoreboard[2].overallScore}<span className="text-xs text-slate-400">/100</span></div>
              <div className="flex justify-center gap-4 text-xs text-slate-300 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {scoreboard[2].citizenRating}/5</span>
                <span>{scoreboard[2].avgResolutionHours}h avg speed</span>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Department Performance Rankings
            </h3>
            <span className="text-xs text-slate-400 font-mono">Updated Real-Time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Citizen Rating</th>
                  <th className="p-4">Avg Resolution Speed</th>
                  <th className="p-4">SLA Compliance</th>
                  <th className="p-4">Resolution Rate</th>
                  <th className="p-4 text-right">Overall Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scoreboard.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold">
                      {getRankBadge(item.rank)}
                    </td>

                    <td className="p-4">
                      <strong className="text-white text-sm block">{item.name}</strong>
                      <span className="text-slate-400 text-[11px] font-mono">{item.code} • {item.totalComplaints} complaints</span>
                    </td>

                    <td className="p-4">
                      <span className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                        <Star className="w-4 h-4 fill-amber-400" /> {item.citizenRating} / 5
                      </span>
                    </td>

                    <td className="p-4 text-slate-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {item.avgResolutionHours} hrs
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {item.slaCompliancePercent}%
                      </span>
                    </td>

                    <td className="p-4 text-slate-300 font-medium">
                      {item.resolutionRatePercent}% resolved ({item.resolvedComplaints}/{item.totalComplaints})
                    </td>

                    <td className="p-4 text-right">
                      <span className="text-xl font-extrabold text-indigo-300 font-mono">
                        {item.overallScore}
                      </span>
                      <span className="text-slate-500 text-[10px]">/100</span>
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
