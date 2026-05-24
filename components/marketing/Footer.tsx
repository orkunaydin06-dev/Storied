import Link from 'next/link';

const links = [
  { href: '/methodology', label: 'Methodology' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/refund', label: 'Refund' },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle/50 px-4 py-12 md:py-16">
      <div className="ink-divider mb-10" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-base text-fg-muted">
            Storied — Built in Dublin
          </p>
          <a
            href="mailto:hello@storied.app"
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200"
          >
            hello@storied.app
          </a>
        </div>

        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:hello@storied.app"
            className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
