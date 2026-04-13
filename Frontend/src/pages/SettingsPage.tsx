import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Lock,
  Database,
  Cpu,
  Mail,
  Cloud,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const SettingsPage = () => {
  const sections = [
    {
      title: 'General Interface',
      icon: Globe,
      description: 'Localization, time zones and display preferences',
      items: ['Language', 'Dashboard Units', 'System Time']
    },
    {
      title: 'Security Engine',
      icon: ShieldAlert,
      description: 'Authentication protocols and breach monitoring',
      items: ['Multi-factor Auth', 'IP Whitelisting', 'Password Policy']
    },
    {
      title: 'Data Infrastructure',
      icon: Database,
      description: 'Storage metrics and backup scheduling',
      items: ['Backup Frequency', 'Retention Policy', 'Cloud Sync']
    },
    {
      title: 'Automation Hub',
      icon: Cpu,
      description: 'Webhooks, API keys and bot configurations',
      items: ['API Tokens', 'Webhook Hooks', 'Trigger Logic']
    }
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">System Configuration</h1>
          <p className="text-slate-500 font-bold text-[10px]">Global environment variables and security nodes</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-white border-slate-100 font-black text-xs px-8">
            Factory Reset
          </Button>
          <Button className="shadow-2xl shadow-indigo-200 px-10">
            Commit Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-2 border-none bg-slate-100" padding="none">
            {[
              { icon: SettingsIcon, label: 'Global Settings', active: true },
              { icon: Bell, label: 'Notification Logic' },
              { icon: Lock, label: 'Access Controls' },
              { icon: Mail, label: 'SMTP Bridge' },
              { icon: Cloud, label: 'Cloud Gateway' },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${item.active ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm tracking-tight">{item.label}</span>
              </button>
            ))}
          </Card>

          <Card className="bg-indigo-600 p-8 border-none text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-lg font-black mb-2 relative z-10">System health</h4>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-indigo-100">All systems nominal</span>
            </div>
            <Button variant="glass" className="w-full relative z-10 text-[10px] font-black">Inspect trace</Button>
          </Card>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {sections.map((section, i) => (
            <Card key={i} className="border-none group shadow-2xl shadow-slate-200/50 hover:shadow-indigo-100/50 transition-all duration-500" padding="lg">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-xl border-4 border-white group-hover:rotate-6 transition-transform">
                    <section.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{section.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-[200px]">{section.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl">
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                </Button>
              </div>

              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300">
                    <span className="text-xs font-black text-slate-700">{item}</span>
                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors"></div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
