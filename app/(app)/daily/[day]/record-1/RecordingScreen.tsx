'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BreathingDot } from '@/components/recording/BreathingDot';
import { WaveformLive } from '@/components/recording/WaveformLive';
import { TimerRing } from '@/components/recording/TimerRing';
import { Button } from '@/components/ui/button';
import { AudioRecorder } from '@/lib/audio/recorder';
import { generatePeaksFromBlob, peaksToIntegers } from '@/lib/audio/waveform';
import { getFileExtension } from '@/lib/audio/formats';
import { formatTime } from '@/lib/utils';

interface RecordingScreenProps {
  dayNumber: number;
  recordingNumber: 1 | 2;
  targetSeconds: number;
  nextPath: string;
}

type RecordingState = 'idle' | 'recording' | 'stopping' | 'uploading' | 'error';
type MicError = 'denied' | 'other';

export function RecordingScreen({
  dayNumber,
  recordingNumber,
  targetSeconds,
  nextPath,
}: RecordingScreenProps) {
  const router = useRouter();
  const recorderRef = useRef<AudioRecorder | null>(null);
  const [state, setState] = useState<RecordingState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [micError, setMicError] = useState<MicError>('other');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOverTarget = elapsed > targetSeconds;
  const isWayOver = elapsed > targetSeconds * 1.5;
  const progress = Math.min(elapsed / targetSeconds, 1);
  const remaining = Math.max(targetSeconds - elapsed, 0);

  // Auto-start on mount
  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-stop at 200% of target
  useEffect(() => {
    if (elapsed >= targetSeconds * 2 && state === 'recording') {
      handleStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, state]);

  async function startRecording() {
    try {
      const recorder = new AudioRecorder();
      const { granted, hardDenied } = await recorder.requestPermission();
      if (!granted) {
        if (hardDenied) {
          setMicError('denied');
          setErrorMsg('Microphone access is blocked. Open your browser settings, allow the microphone for this site, then tap Try again.');
        } else {
          setMicError('other');
          setErrorMsg('Microphone access was denied. Tap Try again to allow it.');
        }
        setState('error');
        return;
      }
      recorderRef.current = recorder;
      await recorder.start(setPeaks);
      setState('recording');
      timerRef.current = setInterval(() => {
        setElapsed(recorder.getDuration());
      }, 100);
    } catch {
      setMicError('other');
      setErrorMsg('Recording failed to start. Please check your microphone and try again.');
      setState('error');
    }
  }

  // DEV ONLY: seed this day via the test API and jump straight to feedback
  async function handleDevBypass() {
    setState('uploading');
    const res = await fetch('/api/dev/seed-practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      setErrorMsg(`Dev seed failed: ${error}`);
      setState('error');
      return;
    }
    const { data } = await res.json();
    router.push(
      recordingNumber === 1
        ? data.links.feedback
        : data.links.compare
    );
  }

  const handleStop = useCallback(async () => {
    if (state !== 'recording' || !recorderRef.current) return;
    setState('stopping');
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await recorderRef.current.stop();
      setState('uploading');

      // Non-fatal — proceed without peaks if decoding fails
      let peakIntegers: number[] = [];
      try {
        const peaks = await generatePeaksFromBlob(result.blob);
        peakIntegers = peaksToIntegers(peaks);
      } catch {
        // ignore
      }

      const ext = getFileExtension(result.mimeType);
      const filename = `day-${String(dayNumber).padStart(2, '0')}/recording-${recordingNumber}.${ext}`;

      // Get signed upload URL
      const urlRes = await fetch('/api/recording/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber, recordingNumber, mimeType: result.mimeType, filename }),
      });

      if (!urlRes.ok) {
        const errBody = await urlRes.json().catch(() => ({}));
        throw new Error(`upload-url failed: ${urlRes.status} ${JSON.stringify(errBody)}`);
      }
      const { data: urlData } = await urlRes.json();
      if (!urlData?.signedUrl) throw new Error('upload-url response missing signedUrl');
      const { signedUrl, recordingId, storagePath } = urlData;

      // Upload to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: result.blob,
        headers: { 'Content-Type': result.mimeType },
      });
      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.text().catch(() => '');
        throw new Error(`storage PUT failed: ${uploadRes.status} ${uploadErr}`);
      }

      // Mark complete + trigger processing
      const completeRes = await fetch('/api/recording/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordingId,
          storagePath,
          durationSeconds: result.durationSeconds,
          fileSizeBytes: result.blob.size,
          mimeType: result.mimeType,
          waveformPeaks: peakIntegers,
        }),
      });

      if (!completeRes.ok) {
        const completeErr = await completeRes.json().catch(() => ({}));
        throw new Error(`complete failed: ${completeRes.status} ${JSON.stringify(completeErr)}`);
      }

      const { data: completeData } = await completeRes.json();
      const finalId = completeData?.recordingId ?? recordingId;
      const dest = new URL(nextPath, window.location.origin);
      dest.searchParams.set('recordingId', finalId);
      router.push(dest.pathname + dest.search);
    } catch (err) {
      console.error('[RecordingScreen]', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setState('error');
    }
  }, [state, dayNumber, recordingNumber, nextPath, router]);

  if (state === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center animate-fade-in">
        <p className="font-serif text-xl text-fg-primary mb-4 max-w-sm">{errorMsg}</p>

        {micError === 'denied' ? (
          <>
            <p className="font-sans text-sm text-fg-muted max-w-xs mb-6">
              Allow the microphone in your browser or device settings, then reload this page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload &amp; try again
            </Button>
          </>
        ) : (
          // Reload forces a fresh permission prompt on most mobile browsers
          <Button onClick={() => window.location.reload()}>
            Try recording again
          </Button>
        )}

        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleDevBypass}
            className="font-mono text-xs text-fg-subtle underline underline-offset-2 opacity-40 hover:opacity-70 transition-opacity mt-8"
          >
            [dev] skip — use test recording
          </button>
        )}
      </div>
    );
  }

  if (state === 'uploading' || state === 'stopping') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="font-serif text-xl text-fg-primary animate-fade-in">Saving your recording...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 gap-10">
      {/* Subtle reminder for R2 */}
      {recordingNumber === 2 && (
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle animate-fade-in">
          Same question. Revised.
        </p>
      )}

      {/* Timer display */}
      <div
        className="font-mono text-6xl md:text-7xl tabular-nums transition-colors duration-300"
        style={{
          color: isWayOver
            ? 'var(--color-warning)'
            : isOverTarget
            ? 'var(--color-warning)'
            : 'var(--color-fg-primary)',
        }}
        aria-live="polite"
        aria-label={`${Math.round(remaining)} seconds remaining`}
      >
        {formatTime(remaining)}
      </div>

      {/* Ring + dot */}
      <div className="relative">
        <TimerRing progress={progress} isOverTarget={isOverTarget} size={160} />
        <div className="absolute inset-0 flex items-center justify-center">
          <BreathingDot />
        </div>
      </div>

      {/* Live waveform */}
      <WaveformLive peaks={peaks} className="max-w-sm" />

      {/* Wrap-up nudge */}
      {isWayOver && (
        <p className="font-sans text-sm text-fg-muted animate-fade-in">Wrapping up?</p>
      )}

      {/* Stop button */}
      <Button
        variant="secondary"
        onClick={handleStop}
        disabled={state !== 'recording'}
        className="min-w-[120px]"
        aria-label="Stop recording"
      >
        Stop
      </Button>

      {/* DEV ONLY: skip recording with silent blob */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleDevBypass}
          className="font-mono text-xs text-fg-subtle underline underline-offset-2 opacity-40 hover:opacity-70 transition-opacity"
        >
          [dev] use test recording
        </button>
      )}

      <div aria-live="assertive" className="sr-only">
        {state === 'recording' ? 'Recording in progress' : 'Recording stopped'}
      </div>
    </div>
  );
}
