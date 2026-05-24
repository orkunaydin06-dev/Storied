import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full bg-bg-secondary text-fg-primary placeholder:text-fg-subtle font-sans px-4 py-3 rounded-lg border border-border-subtle transition-all duration-200 focus:outline-none focus:border-accent-warm focus:ring-1 focus:ring-accent-warm min-h-[44px]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
