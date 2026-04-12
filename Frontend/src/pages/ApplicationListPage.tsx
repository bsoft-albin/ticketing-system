import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Layout,
  Settings,
  Ticket,
  Users,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../api/axios';
import type { ApplicationDto } from '../types';


const ApplicationListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await api.get('/applications');
      return response.data.data as ApplicationDto[];
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Application Registry</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Manage connected projects and service units</p>
        </div>
        <Button className="shadow-2xl shadow-indigo-200">
          <Plus className="w-5 h-5 mr-2" />
          Register New App
        </Button>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by application name or key..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:border-indigo-500/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
          <span>Active Nodes: {applications?.length || 0}</span>
          <div className="h-4 w-px bg-slate-200"></div>
          <span>Status: Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse h-64 bg-slate-100/50 border-none"></Card>
          ))
        ) : applications?.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="group border-none hover-glow relative overflow-hidden h-full" padding="sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="flex items-start justify-between relative z-10 mb-8">
                <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Layout className="w-7 h-7" />
                </div>
                <div className="flex gap-2">
                  <Badge variant={app.isActive ? 'success' : 'secondary'} size="sm">
                    {app.isActive ? 'Operational' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </div>

              <div className="relative z-10 space-y-2 mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{app.name}</h3>
                <p className="text-sm font-bold text-slate-400 line-clamp-2">{app.description || 'No description provided for this application unit.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10 py-6 border-y border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vol.</p>
                    <p className="text-xs font-black text-slate-900">{Math.floor(Math.random() * 200)} Tickets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Agents</p>
                    <p className="text-xs font-black text-slate-900">{Math.floor(Math.random() * 12) + 1} Assigned</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Key: {app.id.slice(0, 8).toUpperCase()}</span>
                <Button variant="ghost" size="sm" className="text-indigo-600 font-black">
                  Manage Node <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationListPage;
