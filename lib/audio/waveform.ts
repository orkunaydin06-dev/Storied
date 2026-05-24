const PEAK_COUNT = 64;

export function extractPeaks(analyser: AnalyserNode): number[] {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  const blockSize = Math.floor(dataArray.length / PEAK_COUNT);
  const peaks: number[] = [];
  for (let i = 0; i < PEAK_COUNT; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += dataArray[i * blockSize + j];
    }
    peaks.push(sum / blockSize / 255);
  }
  return peaks;
}

export async function generatePeaksFromBlob(blob: Blob): Promise<number[]> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / PEAK_COUNT);
  const peaks: number[] = [];
  for (let i = 0; i < PEAK_COUNT; i++) {
    let max = 0;
    for (let j = 0; j < blockSize; j++) {
      const abs = Math.abs(channelData[i * blockSize + j]);
      if (abs > max) max = abs;
    }
    peaks.push(max);
  }
  await audioCtx.close();
  return peaks;
}

export function peaksToIntegers(peaks: number[]): number[] {
  return peaks.map((p) => Math.round(p * 100));
}
