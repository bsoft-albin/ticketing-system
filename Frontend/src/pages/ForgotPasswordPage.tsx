import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { toast } from '../utils/toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Backend expects [FromBody] string email, so we JSON.stringify it to include quotes
      await api.post('/auth/forgot-password', JSON.stringify(email), {
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccess(true);
      toast.success('Inbound message sent', 'Check your inbox for recovery instructions.');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error('Recovery failed', message);
    } finally {
      setIsLoading(false);
    }
  };

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
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                Recover <span className="text-indigo-400">Identity</span>
              </h1>
              <p className="text-slate-400 font-medium">Verify your email to regain workspace access.</p>
            </div>
          </div>
        </motion.div>

        <Card glass className="bg-white/5 border-white/10 backdrop-blur-2xl px-10 py-12">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Check Your Inbox</h3>
              <p className="text-slate-400 font-bold mb-8">
                If an account exists for <span className="text-white">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full border-white/10 text-white">
                  Return to Sign In
                </Button>
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="space-y-6">
                <p className="text-slate-400 text-sm font-bold leading-relaxed">
                  Enter the email address associated with your account and we'll send you a secure link to reset your password.
                </p>
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
                  icon={<Mail className="w-5 h-5" />}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg"
                isLoading={isLoading}
              >
                Send Recovery Link
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
