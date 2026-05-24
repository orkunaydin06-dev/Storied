import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getWeekFromDay(day: number): number {
  if (day <= 6) return 1;
  if (day <= 12) return 2;
  if (day <= 18) return 3;
  if (day <= 24) return 4;
  return 5;
}

export function getTargetDurationForWeek(week: number): number {
  const durations: Record<number, number> = {
    1: 60,
    2: 75,
    3: 90,
    4: 90,
    5: 120,
  };
  return durations[week] ?? 60;
}

export function calculateOverallScore(scores: {
  clarity: number;
  structure: number;
  delivery: number;
  depth: number;
  impact: number;
  authenticity: number;
}): number {
  const { clarity, structure, delivery, depth, impact, authenticity } = scores;
  return Math.round(
    (clarity + structure + delivery + depth + impact + authenticity) / 6
  );
}

export function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  if (hour >= 18 && hour < 22) return 'Good evening';
  return 'Welcome back';
}
