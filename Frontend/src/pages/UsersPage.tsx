import { Users as UsersIcon, UserPlus, Search, MoreVertical, Shield, Mail, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const UsersPage = () => {
  const users = [
    { id: 1, name: 'Albin', email: 'albin@company.com', role: 'Administrator', status: 'Active', department: 'Engineering' },
    { id: 2, name: 'John Doe', email: 'john@company.com', role: 'Support Lead', status: 'Active', department: 'Support' },
    { id: 3, name: 'Alice Smith', email: 'alice@company.com', role: 'Agent', status: 'Busy', department: 'Support' },
    { id: 4, name: 'Mike King', email: 'mike@company.com', role: 'Agent', status: 'Offline', department: 'Operations' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">User Management</h1>
          <p className="text-slate-500 font-bold text-[10px]">Manage access controls and team members</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-white border-slate-100 shadow-sm">
            <Shield className="w-4 h-4 mr-2 text-indigo-500" />
            Security Audit
          </Button>
          <Button className="shadow-2xl shadow-indigo-200">
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Member
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="bg-indigo-600 text-white p-8 overflow-hidden relative group border-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-xl font-black mb-1 relative z-10">Total Active Members</h4>
          <p className="text-4xl font-black mb-4 relative z-10">156</p>
          <div className="flex items-center gap-2 relative z-10">
            <Badge variant="glass" size="sm">+12%</Badge>
            <span className="text-[10px] font-bold text-indigo-100 mt-1">Increasing this week</span>
          </div>
        </Card>

        <Card className="border-none bg-emerald-500 text-white p-8 relative overflow-hidden group border-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-xl font-black mb-1 relative z-10">System Reliability</h4>
          <p className="text-4xl font-black mb-4 relative z-10">99.9%</p>
          <div className="flex items-center gap-2 relative z-10">
            <Badge className="bg-white/20 border-white/30 text-white" size="sm">Optimal</Badge>
            <span className="text-[10px] font-bold text-emerald-50 mt-1">Last 30 days</span>
          </div>
        </Card>

        <Card className="border-none bg-slate-900 text-white p-8 relative overflow-hidden group border-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-xl font-black mb-1 relative z-10">Security Events</h4>
          <p className="text-4xl font-black mb-4 relative z-10">0</p>
          <div className="flex items-center gap-2 relative z-10">
            <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400" size="sm">Secure</Badge>
            <span className="text-[10px] font-bold text-slate-400 mt-1">No alerts detected</span>
          </div>
        </Card>
      </div>

      <Card className="border-none" padding="none">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search members by name, ID or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-indigo-600 font-black">Export Data</Button>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-xs font-black text-slate-900">{users.length} Active Users</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Role & Dept</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Presence</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-white shadow-sm flex items-center justify-center text-indigo-600 font-black text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{user.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1">ID: USR-{user.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 tracking-tight">{user.role}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{user.department}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Busy' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs font-bold text-slate-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs font-bold">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white shadow-sm transition-all">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-indigo-50 text-indigo-600">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
