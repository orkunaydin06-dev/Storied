import Link from 'next/link';

const links = [
  { href: '/methodology', label: 'Methodology' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/refund', label: 'Refund' },
];

export function Footer() {
  return (
    <footer className="mt-auto pt-16 border-t border-border-subtle/50 text-center pb-12 max-w-md mx-auto px-6">
      <div className="space-y-1 mb-6">
        <p className="text-xs text-fg-muted">Storied — Built in Dublin</p>
        <a
          href="mailto:hello@storied.app"
          className="text-xs text-fg-muted hover:text-accent-warm transition-colors"
        >
          hello@storied.app
        </a>
      </div>
      <div className="flex justify-center gap-6 text-[10px] font-bold tracking-widest text-fg-muted uppercase">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-accent-warm transition-colors">
            {l.label}
          </Link>
        ))}
        <a href="mailto:hello@storied.app" className="hover:text-accent-warm transition-colors">
          Contact
        </a>
      </div>
    </footer>
  );
}
