import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from './Button';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-600">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white/50 backdrop-blur-sm border-2 border-slate-100 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none',
              icon && 'pl-11',
              error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-bold text-rose-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
