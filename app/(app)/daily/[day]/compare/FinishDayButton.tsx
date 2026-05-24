'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function FinishDayButton({
  dayNumber,
  r1Id,
  r2Id,
}: {
  dayNumber: number;
  r1Id: string;
  r2Id: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    await fetch('/api/practice/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber }),
    });
    router.push(`/daily/${dayNumber}/closure?r1Id=${r1Id}&r2Id=${r2Id}`);
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button size="lg" onClick={handleFinish} disabled={loading}>
        {loading ? 'Saving…' : `Finish Day ${dayNumber}`}
      </Button>
      <button
        onClick={handleFinish}
        disabled={loading}
        className="font-sans text-sm text-fg-subtle hover:text-fg-muted transition-colors duration-200 underline-offset-4 hover:underline disabled:opacity-50"
      >
        Return to dashboard
      </button>
    </div>
  );
}
