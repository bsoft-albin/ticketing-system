import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Ticket, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  FolderKanban,
  History,
  Users,
  Search
} from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { Button, cn } from '../components/ui/Button';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: { 
  icon: any, 
  label: string, 
  href: string, 
  active: boolean,
  collapsed: boolean 
}) => (
  <Link
    to={href}
    className="block group"
  >
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden',
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 relative z-10', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-sm font-bold tracking-tight relative z-10 whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-indigo-600 z-0"
        />
      )}
    </div>
  </Link>
);

const Sidebar = ({ collapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) => {

  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Ticket, label: 'Tickets', href: '/tickets' },
    { icon: FolderKanban, label: 'Applications', href: '/applications' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: History, label: 'Audit Logs', href: '/audit-logs' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full glass-panel bg-white/70 backdrop-blur-2xl transition-all duration-500 z-50 flex flex-col',
      collapsed ? 'w-24' : 'w-72'
    )}>
      <div className="h-24 flex items-center px-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 animate-float">
            <Ticket className="w-6 h-6" />
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-slate-900 text-xl tracking-tighter"
            >
              Ticketing<span className="text-indigo-600">Pro</span>
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-6">
        <div className={cn(
          'flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 bg-slate-50 border border-slate-100',
          collapsed ? 'justify-center' : ''
        )}>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex-shrink-0">
            {user?.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-bold uppercase">{user?.fullName?.charAt(0) || 'U'}</div>}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{user?.fullName || 'User Name'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.role || 'Agent'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const Navbar = ({ collapsed, toggleSidebar }: { collapsed: boolean, toggleSidebar: () => void }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <header className={cn(
      'fixed top-0 right-0 h-20 bg-white/60 backdrop-blur-xl border-b border-white/20 transition-all duration-500 z-40 flex items-center justify-between px-8',
      collapsed ? 'left-24' : 'left-72'
    )}>
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-xl hover:bg-slate-100"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl w-80 group focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white ring-2 ring-indigo-50"></span>
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => { logout(); navigate('/login'); }}
          className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      
      <main className={cn(
        'transition-all duration-500 pt-20 min-h-screen',
        collapsed ? 'pl-24' : 'pl-72'
      )}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          className="p-10 max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
