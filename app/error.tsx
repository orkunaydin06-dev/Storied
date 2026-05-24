'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-6">Error</p>
      <h1 className="font-serif text-3xl text-fg-primary mb-4">Something went wrong</h1>
      <p className="font-sans text-sm text-fg-muted mb-10 max-w-xs">
        An unexpected error occurred. Your recording is safe — please try again.
      </p>
      <button
        onClick={reset}
        className="font-sans text-sm text-accent-warm underline underline-offset-4 hover:text-accent-warm-hover transition-colors duration-200"
      >
        Try again
      </button>
    </div>
  );
}
