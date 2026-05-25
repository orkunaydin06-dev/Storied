import Link from 'next/link';

interface StoriedLogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StoriedLogo({ href = '/', size = 'md' }: StoriedLogoProps) {
  const iconSize = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-16 h-16 text-3xl' : 'w-9 h-9 text-xl';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const inner = (
    <div className="flex items-center gap-3 group">
      <div className="relative flex items-center justify-center" style={{ width: size === 'lg' ? 64 : size === 'sm' ? 32 : 36, height: size === 'lg' ? 64 : size === 'sm' ? 32 : 36 }}>
        <div className="absolute inset-0 bg-accent-warm/20 blur-md rounded-full group-hover:bg-accent-warm/40 transition-colors duration-500" />
        <div
          className="relative w-full h-full border border-accent-warm/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:border-accent-warm/60 transition-all duration-500"
          style={{ boxShadow: '0 0 15px rgba(217,160,91,0.2)' }}
        >
          <svg
            className={`${iconSize === 'w-8 h-8 text-sm' ? 'w-4 h-4' : iconSize === 'w-16 h-16 text-3xl' ? 'w-8 h-8' : 'w-5 h-5'} text-accent-warm`}
            style={{ animation: 'spin-logo 10s linear infinite' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 12c-2-2.5-4-4-4-6.5a4 4 0 0 1 8 0c0 2.5-2 4-4 6.5" />
            <path d="M12 12c2 2.5 4 4 4 6.5a4 4 0 0 1-8 0c0-2.5 2-4 4-6.5" />
          </svg>
        </div>
      </div>
      <span
        className={`font-heading font-bold ${textSize} tracking-[0.2em] uppercase bg-gradient-to-r from-fg-primary via-accent-warm to-fg-primary bg-clip-text text-transparent group-hover:tracking-[0.25em] transition-all duration-700`}
      >
        Storied
      </span>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function StoriedLogoSmall({ href = '/' }: { href?: string }) {
  const inner = (
    <div className="flex items-center gap-2 group">
      <div
        className="w-8 h-8 border border-accent-warm/30 rounded-full flex items-center justify-center backdrop-blur-sm"
      >
        <svg
          className="w-4 h-4 text-accent-warm"
          style={{ animation: 'spin-logo 10s linear infinite' }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <path d="M12 12c-2-2.5-4-4-4-6.5a4 4 0 0 1 8 0c0 2.5-2 4-4 6.5" />
          <path d="M12 12c2 2.5 4 4 4 6.5a4 4 0 0 1-8 0c0-2.5 2-4 4-6.5" />
        </svg>
      </div>
      <span className="font-heading font-bold text-sm tracking-[0.2em] uppercase bg-gradient-to-r from-fg-primary to-accent-warm bg-clip-text text-transparent">
        Storied
      </span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
