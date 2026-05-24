import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] select-none',
  {
    variants: {
      variant: {
        primary:
          'relative overflow-hidden bg-accent-warm text-bg-primary ' +
          'shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_12px_rgba(232,181,71,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] ' +
          'hover:-translate-y-px hover:bg-accent-warm-hover hover:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(232,181,71,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] ' +
          'active:translate-y-0 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]',
        secondary:
          'bg-transparent text-fg-primary border border-border-visible ' +
          'shadow-[0_1px_3px_rgba(0,0,0,0.15)] ' +
          'hover:bg-bg-secondary hover:border-fg-muted hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] ' +
          'active:translate-y-0 active:scale-[0.98]',
        ghost:
          'bg-transparent text-fg-muted hover:text-fg-primary hover:underline underline-offset-4 transition-colors duration-200 active:scale-[0.97]',
        destructive:
          'bg-transparent text-error border border-error/50 hover:bg-error/10 active:scale-[0.98]',
      },
      size: {
        sm: 'text-sm px-4 py-2',
        md: 'text-base px-6 py-3',
        lg: 'text-lg px-8 py-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
