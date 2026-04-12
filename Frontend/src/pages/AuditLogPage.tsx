import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  User,
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Button, cn } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../api/axios';
import type { AuditLogDto } from '../types';


const AuditLogPage = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await api.get('/auditlogs');
      return response.data.data as AuditLogDto[];
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Immutable Audit Trails</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Verified system activity and security logs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-slate-100">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="secondary">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Verify Logs
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none" padding="sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Statistics</h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs</p>
                <p className="text-2xl font-black text-slate-900">{logs?.length || 0}</p>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Security Events</p>
                <p className="text-2xl font-black">24</p>
              </div>
            </div>
          </Card>

          <Card className="border-none" padding="sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Quick Filter</h4>
            <div className="space-y-4">
              {['All Activities', 'User Actions', 'System Tasks', 'Security Alerts'].map((f, i) => (
                <button key={i} className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  i === 0 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
                )}>
                  {f}
                  {i === 0 && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-none" padding="none">
            <div className="p-8 border-b border-slate-50">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter logs by user, action, or entity..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {isLoading ? (
                  <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs tracking-widest">Hydrating audit trails...</div>
                ) : logs?.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow-xl shadow-slate-200/50 text-indigo-600 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5" />
                    </div>

                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-50 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="primary" size="sm" className="font-black">{log.entityName}</Badge>
                        <time className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</time>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-900 tracking-tight leading-relaxed">
                          Action <span className="text-indigo-600 uppercase italic">{log.action}</span> performed on {log.entityName} record.
                        </p>
                        <div className="flex items-center gap-3 py-3 border-y border-slate-50">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Executor</p>
                            <p className="text-xs font-black text-slate-900">{log.userName || 'System'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Database className="w-3.5 h-3.5" />
                            ID: {log.entityId.slice(0, 8)}...
                          </div>
                          <Button variant="ghost" size="sm" className="text-indigo-600 font-black h-8 px-2">
                            Details <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Placeholder icons that were missing in local scope
const Download = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

export default AuditLogPage;

