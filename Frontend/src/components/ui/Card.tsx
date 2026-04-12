import { forwardRef } from 'react';


import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

import { cn } from './Button';

interface CardProps extends HTMLMotionProps<'div'> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', glass = true, children, ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-8',
      lg: 'p-12',
    };

    return (
      <motion.div
        ref={ref as any}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'rounded-3xl transition-all duration-300',
          glass ? 'glass-card' : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
