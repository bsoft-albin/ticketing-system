import type { HTMLAttributes } from 'react';

import { cn } from './Button';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: BadgeProps) => {
  const variants = {
    primary: 'bg-indigo-50/50 text-indigo-700 border-indigo-200/50',
    secondary: 'bg-slate-50/50 text-slate-700 border-slate-200/50',
    success: 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50',
    warning: 'bg-amber-50/50 text-amber-700 border-amber-200/50',
    danger: 'bg-rose-50/50 text-rose-700 border-rose-200/50',
    info: 'bg-sky-50/50 text-sky-700 border-sky-200/50',
    ghost: 'bg-transparent text-slate-500 border-slate-100',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] uppercase font-black tracking-widest',
    md: 'px-2.5 py-1 text-xs font-bold uppercase tracking-wider',
    lg: 'px-3 py-1.5 text-sm font-black uppercase tracking-widest',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border backdrop-blur-[2px] transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
