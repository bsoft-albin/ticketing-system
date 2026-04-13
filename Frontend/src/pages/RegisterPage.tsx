import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Lock, Mail, User, ArrowRight, ArrowLeft } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { toast } from '../utils/toast';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/register', { 
        fullName, 
        email, 
        password 
      });
      setSuccess(true);
      toast.success('Request received', 'Your access request has been submitted for verification.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error('Registration failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
        <Card glass className="max-w-md w-full text-center p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <ArrowRight className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4">Request Sent!</h2>
          <p className="text-slate-400 font-bold mb-8">
            Your access request has been received. Redirecting you to login...
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white transition-colors font-bold text-sm mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          <div className="flex items-center gap-6">
            <div className="inline-flex items-center justify-center w-16 h-16 premium-gradient rounded-2xl shadow-2xl shadow-indigo-500/20 animate-float">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                Request <span className="text-indigo-400">Access</span>
              </h1>
              <p className="text-slate-400 font-medium">Join the next generation of ticketing operations.</p>
            </div>
          </div>
        </motion.div>

        <Card glass className="bg-white/5 border-white/10 backdrop-blur-2xl px-10 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-6">
              <Input 
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                icon={<User className="w-5 h-5" />}
              />

              <Input 
                label="Work Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                icon={<Mail className="w-5 h-5" />}
              />
              
              <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              isLoading={isLoading}
            >
              Submit Access Request
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-10 text-slate-500 font-bold">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
