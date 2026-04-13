import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  MoreVertical,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Tag,
  Share2,
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Edit,
  Download
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../api/axios';
import { TicketPriority, type TicketDto, TicketStatus } from '../types';


const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: ticket, isLoading: isTicketLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data as TicketDto;
    },
  });

  const { data: comments } = useQuery({

    queryKey: ['ticket-comments', id],
    queryFn: async () => {
      const response = await api.get(`/tickets/${id}/comments`);
      return response.data.data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await api.post(`/tickets/${id}/comments`, text);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', id] });
      setComment('');
    },
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return <Badge variant="primary" className="h-8 px-4">Open</Badge>;
      case TicketStatus.IN_PROGRESS: return <Badge variant="warning" className="h-8 px-4">In Progress</Badge>;
      case TicketStatus.RESOLVED: return <Badge variant="success" className="h-8 px-4">Resolved</Badge>;
      case TicketStatus.CLOSED: return <Badge variant="secondary" className="h-8 px-4">Closed</Badge>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW: return <Badge variant="info" size="sm">Low</Badge>;
      case TicketPriority.MEDIUM: return <Badge variant="warning" size="sm">Medium</Badge>;
      case TicketPriority.HIGH: return <Badge variant="danger" size="sm">High</Badge>;
      case TicketPriority.CRITICAL: return <Badge className="bg-rose-600 text-white" size="sm">Critical</Badge>;
      default: return null;
    }
  };

  if (isTicketLoading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">Synchronizing data node...</div>;
  if (!ticket) return <div className="p-20 text-center font-black text-rose-500">Data hub error: Ticket not found</div>;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/tickets')} className="w-12 h-12 rounded-2xl border-slate-100 bg-white hover:bg-slate-50">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-indigo-600 tracking-tight">T-{ticket.id.slice(0, 8)}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400">{ticket.appName}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{ticket.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 px-6 bg-white border-slate-100">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button className="h-12 px-8 shadow-2xl shadow-indigo-200">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Resolve Ticket
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">
          {/* Ticket Body */}
          <Card className="border-none group" padding="lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-indigo-600 font-black text-xl border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                  {ticket.creatorName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{ticket.creatorName}</p>
                  <p className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Published on {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(ticket.status)}
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-700 font-medium leading-relaxed tracking-tight whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 flex flex-wrap gap-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400">Impact:</span>
                {getPriorityBadge(ticket.priority)}
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400">Category:</span>
                <span className="text-[10px] font-black text-slate-900">{ticket.type === 0 ? 'Bug' : ticket.type === 1 ? 'Feature' : 'Enhancement'}</span>
              </div>
            </div>
          </Card>

          {/* Discussion Thread */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              <MessageSquare className="w-7 h-7 text-indigo-600" />
              Intelligence Thread
              <span className="text-sm font-bold text-slate-400">({comments?.length || 0})</span>
            </h3>

            <div className="space-y-6">
              {comments?.map((comment: any, index: number) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-black text-sm border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                    {comment.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <Card className="border-none shadow-xl shadow-slate-200/30 group-hover:shadow-indigo-100/50 transition-all" padding="sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-black text-slate-900 tracking-tight">{comment.userName}</span>
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Comment Form */}
            <Card glass className="bg-white/80 border-indigo-100/50" padding="md">
              <div className="space-y-6">
                <textarea
                  className="w-full bg-slate-50/50 rounded-2xl border-none p-6 text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[150px]"
                  placeholder="Analyze and provide internal feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-slate-500 font-black text-xs hover:bg-white rounded-xl">
                      <Paperclip className="w-4 h-4 mr-2" /> Attach Intel
                    </Button>
                    <div className="w-px h-6 bg-slate-100"></div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all" />
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors">Internal directive</span>
                    </label>
                  </div>
                  <Button
                    onClick={() => addCommentMutation.mutate(comment)}
                    isLoading={addCommentMutation.isPending}
                    disabled={!comment.trim()}
                    className="px-10 h-12 shadow-2xl shadow-indigo-100"
                  >
                    Post Intel <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          <Card className="border-none shadow-2xl shadow-slate-200/50" padding="none">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <ShieldCheck className="w-6 h-6 text-indigo-600" /> Administrative Metadata
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400">Operational owner</p>
                {ticket.assignedTo ? (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
                      {ticket.assigneeName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{ticket.assigneeName}</p>
                      <p className="text-[10px] font-black text-emerald-500 mt-1">Status: Active</p>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl">
                      <Edit className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full h-14 border-dashed border-2 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all font-black text-xs flex items-center justify-center gap-3 rounded-2xl">
                    <UserPlus className="w-4 h-4" /> reassign agent
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400">Environment</p>
                  <p className="text-xs font-black text-slate-900 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">Cluster Beta</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400">Lifecycle</p>
                  <p className="text-xs font-black text-slate-900 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">Maintenance</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400">SLA Countdown</p>
                <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 animate-pulse">
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-black">Expiring in 03:42:15</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
              <Button variant="ghost" className="text-rose-600 font-black text-xs hover:bg-rose-50 px-4">
                <Trash2 className="w-4 h-4 mr-2" /> Purge
              </Button>
              <Button variant="ghost" className="text-slate-500 font-black text-xs hover:bg-slate-200 px-4">
                <Lock className="w-4 h-4 mr-2" /> Lock
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50" padding="none">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <Paperclip className="w-6 h-6 text-indigo-600" /> Attached Artifacts
              </h3>
            </div>
            <div className="p-8 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">log_fragment_{i}.enc</p>
                    <p className="text-[10px] font-black text-slate-400">SHA-256 verified</p>
                  </div>
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
                    <Download className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full h-14 border-dashed border-2 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all font-black text-xs rounded-[1.25rem]">
                Add new artifact
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
