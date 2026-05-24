'use client';

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { LoadingState } from '@/components/shared/LoadingState';

function ProcessingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const dayNumber = params.day as string;
  const recordingId = searchParams.get('recordingId');
  const r1Id = searchParams.get('r1Id');
  const recordingNum = searchParams.get('r') === '2' ? 2 : 1;
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!recordingId) return;

    const TIMEOUT = 60000;
    const POLL_INTERVAL = 2000;
    let elapsed = 0;

    const interval = setInterval(async () => {
      elapsed += POLL_INTERVAL;

      if (elapsed > TIMEOUT) {
        clearInterval(interval);
        setError(true);
        return;
      }

      try {
        const res = await fetch(`/api/recording/${recordingId}`);
        if (!res.ok) return;
        const { data: recording } = await res.json();

        if (recording?.feedback_status === 'ready' || recording?.feedback_status === 'edge_case') {
          clearInterval(interval);
          const nextPath =
            recordingNum === 1
              ? `/daily/${dayNumber}/feedback?recordingId=${recordingId}`
              : `/daily/${dayNumber}/compare?recordingId=${recordingId}&r1Id=${r1Id}`;
          router.push(nextPath);
        } else if (recording?.feedback_status === 'failed') {
          clearInterval(interval);
          setError(true);
        }
      } catch {
        // Keep polling on network errors
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [recordingId, recordingNum, dayNumber, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="font-serif text-xl text-fg-primary mb-4 max-w-sm">
          Feedback is taking longer than expected.
        </p>
        <p className="font-sans text-sm text-fg-muted max-w-sm">
          Your recording is saved safely. Refresh in a moment.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 font-sans text-sm text-accent-warm underline underline-offset-4"
        >
          Refresh now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <LoadingState />
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingState />
        </div>
      }
    >
      <ProcessingInner />
    </Suspense>
  );
}
