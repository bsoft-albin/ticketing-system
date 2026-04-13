import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../api/axios';
import { toast } from '../utils/toast';
import { TicketPriority, type TicketDto, TicketStatus } from '../types';


const TicketListPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', page, pageSize],
    queryFn: async () => {
      const response = await api.get(`/tickets?pageNumber=${page}&pageSize=${pageSize}`);
      return response.data.data as TicketDto[];
    },
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return <Badge variant="primary">Open</Badge>;
      case TicketStatus.IN_PROGRESS: return <Badge variant="warning">In Progress</Badge>;
      case TicketStatus.RESOLVED: return <Badge variant="success">Resolved</Badge>;
      case TicketStatus.CLOSED: return <Badge variant="secondary">Closed</Badge>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW: return <Badge variant="info" size="sm">Low</Badge>;
      case TicketPriority.MEDIUM: return <Badge variant="warning" size="sm">Medium</Badge>;
      case TicketPriority.HIGH: return <Badge variant="danger" size="sm">High</Badge>;
      case TicketPriority.CRITICAL: return <Badge className="bg-rose-600 text-white border-transparent" size="sm">Critical</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Service Tickets</h1>
          <p className="text-slate-500 font-bold text-[10px]">Manage and track all support requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-white border-slate-100">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="shadow-2xl shadow-indigo-200">
            <Plus className="w-5 h-5 mr-2" />
            Create New Ticket
          </Button>
        </div>
      </header>

      <Card className="border-none" padding="none">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, ID or requester..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-black text-slate-400">
            <span>Showing {data?.length || 0} Results</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span>Sorted by Date Created</span>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-50/50 border-b border-slate-50"
            >
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400">Status</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option>All Statuses</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400">Priority</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option>All Priorities</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400">Application</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option>All Apps</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button variant="ghost" className="w-full text-indigo-600 font-black">Reset Filters</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Subject & Req.</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Application</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Owner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-full w-full"></div></td>
                  </tr>
                ))
              ) : data?.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{ticket.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">ID: {ticket.id.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="ghost" className="font-black">{ticket.appName}</Badge>
                  </td>
                  <td className="px-8 py-6">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-8 py-6">{getStatusBadge(ticket.status)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                        {ticket.assigneeName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{ticket.assigneeName || 'Unassigned'}</span>

                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-9 h-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={(e) => { e.stopPropagation(); toast.info('Edit mode coming soon', 'This data record is currently locked for editing.'); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); toast.error('Purge restricted', 'You do not have administrative clearance to delete this record.'); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-3xl mb-4">
                      <Search className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-xs">No tickets match your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-black text-slate-400">
            Showing <span className="text-slate-900">{data?.length || 0}</span> of <span className="text-slate-900">120</span> tickets
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 border-slate-100">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(i => (
                <Button key={i} variant={page === i ? 'primary' : 'ghost'} className="w-10 h-10 p-0 font-black text-xs" onClick={() => setPage(i)}>
                  {i}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} className="w-10 h-10 border-slate-100">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TicketListPage;
