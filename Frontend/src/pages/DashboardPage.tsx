import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Ticket,
  CheckCircle2,
  Clock,
  Activity,
  Plus,
  Users,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button, cn } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../api/axios';
import { TicketPriority, type DashboardSummaryDto, type TicketDto, TicketStatus } from '../types';


const StatCard = ({ title, value, icon: Icon, color, trend, delay }: any) => (
  <Card
    className="relative group overflow-hidden border-none"
    padding="sm"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 duration-700 ${color}`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{value}</h3>
        {trend && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex items-center text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
              trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <Target className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">vs last month</span>
          </div>
        )}
      </div>
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110",
        color
      )}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </Card>
);

const DashboardPage = () => {
  const { data: summary } = useQuery({

    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data as DashboardSummaryDto;
    },
  });

  const { data: recentTickets } = useQuery({

    queryKey: ['recent-tickets'],
    queryFn: async () => {
      const response = await api.get('/tickets?pageSize=5');
      return response.data.data as TicketDto[];
    },
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return <Badge variant="primary" size="sm">Open</Badge>;
      case TicketStatus.IN_PROGRESS: return <Badge variant="warning" size="sm">In Progress</Badge>;
      case TicketStatus.RESOLVED: return <Badge variant="success" size="sm">Resolved</Badge>;
      case TicketStatus.CLOSED: return <Badge variant="secondary" size="sm">Closed</Badge>;
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
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tighter mb-2"
          >
            Executive Summary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-bold"
          >
            Insights and performance metrics for your ticketing ecosystem.
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex bg-white shadow-sm border-slate-100">
            <Activity className="w-4 h-4 mr-2 text-indigo-500" />
            System Status
          </Button>
          <Button className="shadow-2xl shadow-indigo-200">
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={summary?.totalTickets || 0}
          icon={Ticket}
          color="bg-indigo-600"
          trend={12}
          delay={0.1}
        />
        <StatCard
          title="Open Tickets"
          value={summary?.openTickets || 0}
          icon={Clock}
          color="bg-amber-500"
          trend={-5}
          delay={0.2}
        />
        <StatCard
          title="Resolved"
          value={summary?.resolvedTickets || 0}
          icon={CheckCircle2}
          color="bg-emerald-500"
          trend={8}
          delay={0.3}
        />
        <StatCard
          title="SLA Performance"
          value="98.2%"
          icon={Activity}
          color="bg-purple-600"
          trend={2}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none" padding="none">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            </div>
            <Button variant="ghost" className="text-indigo-600 font-black">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ticket Identity</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current State</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTickets?.map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{ticket.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ticket.appName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">{getStatusBadge(ticket.status)}</td>
                    <td className="px-8 py-5">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-xs font-black text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="border-none" padding="none">
            <div className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Performers</h3>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {[
                { name: 'John Doe', role: 'Senior Agent', count: 24, initial: 'JD' },
                { name: 'Alice Smith', role: 'Support Specialist', count: 18, initial: 'AS' },
                { name: 'Mike King', role: 'Technical Lead', count: 15, initial: 'MK' },
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-slate-500 font-black text-xs group-hover:scale-110 transition-transform">
                        {agent.initial}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{agent.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{agent.count} RESOLVED</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">TOP 5%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card glass className="bg-indigo-600 text-white p-8 overflow-hidden relative group border-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-xl font-black mb-2 relative z-10">Scale your support</h4>
            <p className="text-indigo-100 text-sm font-bold mb-6 relative z-10">Add more agents and automation to improve performance.</p>
            <Button variant="glass" className="w-full relative z-10">
              Upgrade Workspace
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
