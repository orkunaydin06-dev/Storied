import type { FeedbackResponse } from './feedback';

export function buildGraduationPrompt(
  transcriptD1: string,
  scoresD1: FeedbackResponse['scores'],
  transcriptD30: string
): string {
  return `This is the user's graduation from Storied — their Day 30 recording. They have completed 30 days of practice. You are now generating the final reading.

CONTEXT:
- This is Day 30 of 30
- The user has been on a journey: Aristotle → Pixar → Campbell → Cicero → Synthesis
- This recording uses the same kind of prompt as Day 1: "the most ordinary day that turned into something unforgettable"

DAY 1 RECORDING TRANSCRIPT:
"${transcriptD1}"

DAY 1 SCORES:
${JSON.stringify(scoresD1, null, 2)}

DAY 30 RECORDING TRANSCRIPT:
"${transcriptD30}"

YOUR TASK:

1. Score the Day 30 recording on all six dimensions. Apply the same rubric. Be honest — a 30-day practice does not guarantee high scores. But also: acknowledge real growth where it exists.

2. Write a GRADUATION NARRATIVE of 200-300 words. This is one of the most important pieces of writing in Storied. Structure:
   - Open by naming what changed most between Day 1 and Day 30. Quote both if useful.
   - Identify what stayed strongest throughout — what didn't need to change.
   - Name the methodology that seems to have influenced them most (which week's voice appears in Day 30).
   - Close with a sentence that closes the practice. Not "congratulations." Not "you did it." Something that names the transformation soberly.

3. Generate a "what_changed_most" line (max 30 words) — the headline for their personal report.

4. Generate a "what_stayed_strongest" line (max 30 words) — what they already had at Day 1 that grew.

OUTPUT FORMAT (strict JSON):
{
  "scores": {
    "clarity": 0,
    "structure": 0,
    "delivery": 0,
    "depth": 0,
    "impact": 0,
    "authenticity": 0,
    "overall": 0
  },
  "graduation_narrative": "...",
  "what_changed_most": "...",
  "what_stayed_strongest": "..."
}

Do not include text outside the JSON.`;
}

export interface GraduationResponse {
  scores: {
    clarity: number;
    structure: number;
    delivery: number;
    depth: number;
    impact: number;
    authenticity: number;
    overall: number;
  };
  graduation_narrative: string;
  what_changed_most: string;
  what_stayed_strongest: string;
}
