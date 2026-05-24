export type AudioMimeType = 'audio/webm;codecs=opus' | 'audio/mp4' | 'audio/ogg;codecs=opus' | 'audio/webm';

export function getSupportedMimeType(): AudioMimeType {
  const types: AudioMimeType[] = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'audio/webm';
}

/** Remove whitespace around semicolons so "audio/webm; codecs=opus" → "audio/webm;codecs=opus" */
export function normalizeMimeType(mimeType: string): string {
  return mimeType.replace(/\s*;\s*/g, ';').toLowerCase().trim();
}

export function getFileExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
}
