'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  speed?: string;
}

export function ShimmerButton({ children, className, speed = '3s', ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center gap-2',
        'hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
        className
      )}
      style={{
        background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
        backgroundSize: '200% auto',
        animation: `shimmer ${speed} linear infinite`,
        boxShadow: '0 15px 40px rgba(217,160,91,0.25)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function ShimmerLink({
  children,
  href,
  className,
  speed = '3s',
}: {
  children: ReactNode;
  href: string;
  className?: string;
  speed?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'w-full py-5 rounded-2xl font-bold text-black flex items-center justify-center gap-2',
        'hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
        className
      )}
      style={{
        background: 'linear-gradient(to right, #d9a05b, #f5d0a0, #d9a05b)',
        backgroundSize: '200% auto',
        animation: `shimmer ${speed} linear infinite`,
        boxShadow: '0 15px 40px rgba(217,160,91,0.25)',
      }}
    >
      {children}
    </a>
  );
}
