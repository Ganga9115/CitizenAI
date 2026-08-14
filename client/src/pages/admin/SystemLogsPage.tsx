import React, { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { apiClient } from '../../services/api';
import { ShieldCheck, Clock, Terminal } from 'lucide-react';

export const SystemLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await apiClient.get('/admin/audit-logs');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-indigo-400" /> Platform System Audit Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time audit trail of user events, status updates, and security logs</p>
        </div>

        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden font-mono text-xs">
          <div className="p-4 bg-slate-900/90 border-b border-white/10 font-bold text-indigo-300 flex items-center justify-between">
            <span>Audit Event Log Stream</span>
            <span>Total Records: {logs.length}</span>
          </div>

          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {log.action}
                    </span>
                    <span className="text-white font-sans font-semibold">{log.user_name || 'System'}</span>
                  </div>
                  <pre className="text-slate-400 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-white/5 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>

                <div className="text-right text-slate-500 text-[11px] shrink-0">
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                  <span className="block text-slate-600">{log.ip_address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
