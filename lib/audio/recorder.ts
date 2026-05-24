import { getSupportedMimeType, normalizeMimeType } from './formats';
import { extractPeaks } from './waveform';

export interface RecorderState {
  isRecording: boolean;
  durationSeconds: number;
  peaks: number[];
}

export interface RecordingResult {
  blob: Blob;
  mimeType: string;
  durationSeconds: number;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private chunks: BlobPart[] = [];
  private startTime = 0;
  private animationFrame = 0;
  private onPeaksUpdate: ((peaks: number[]) => void) | null = null;

  async requestPermission(): Promise<{ granted: boolean; hardDenied: boolean }> {
    // Check Permissions API first — tells us if the browser has it locked to "denied"
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (result.state === 'denied') {
          return { granted: false, hardDenied: true };
        }
      } catch {
        // Permissions API not supported on this browser — fall through to getUserMedia
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      return { granted: true, hardDenied: false };
    } catch (err) {
      const name = err instanceof Error ? err.name : '';
      const hardDenied = name === 'NotAllowedError' || name === 'PermissionDeniedError';
      return { granted: false, hardDenied };
    }
  }

  async start(onPeaksUpdate: (peaks: number[]) => void): Promise<void> {
    this.onPeaksUpdate = onPeaksUpdate;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const mimeType = getSupportedMimeType();

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start(100);
    this.startTime = Date.now();
    this.tick();
  }

  private tick() {
    if (!this.analyser || !this.onPeaksUpdate) return;
    const peaks = extractPeaks(this.analyser);
    this.onPeaksUpdate(peaks);
    this.animationFrame = requestAnimationFrame(() => this.tick());
  }

  stop(): Promise<RecordingResult> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;
      const durationSeconds = (Date.now() - this.startTime) / 1000;
      cancelAnimationFrame(this.animationFrame);

      this.mediaRecorder.onstop = () => {
        const mimeType = normalizeMimeType(this.mediaRecorder!.mimeType);
        const blob = new Blob(this.chunks, { type: mimeType });
        this.mediaRecorder!.stream.getTracks().forEach((t) => t.stop());
        this.audioContext?.close();
        resolve({ blob, mimeType, durationSeconds });
      };

      this.mediaRecorder.stop();
    });
  }

  getDuration(): number {
    if (!this.startTime) return 0;
    return (Date.now() - this.startTime) / 1000;
  }
}
