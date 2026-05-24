import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-8">
          404
        </p>
        <h1 className="font-serif text-3xl text-fg-primary mb-4">
          Nothing here.
        </h1>
        <p className="font-sans text-base text-fg-muted mb-12">
          The page you were looking for does not exist.
        </p>
        <Link
          href="/"
          className="font-sans text-sm text-fg-muted underline underline-offset-4 hover:text-fg-primary transition-colors duration-200"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
