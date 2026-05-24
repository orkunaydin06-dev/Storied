import type { DayContent } from '@/data/curriculum/days';
import type { FeedbackResponse } from './feedback';

export function buildComparisonPrompt(
  day: DayContent,
  transcriptR1: string,
  scoresR1: FeedbackResponse['scores'],
  revisionPrompt: string,
  transcriptR2: string
): string {
  return `The user has now completed Recording 2 of the same daily practice in Storied. You previously gave them feedback on Recording 1 and a specific revision direction. They have re-recorded with that direction in mind.

CONTEXT:
- Day: ${day.day}
- Week: ${day.week}
- Methodology: ${day.methodologyName}

RECORDING 1 TRANSCRIPT:
"${transcriptR1}"

RECORDING 1 SCORES:
${JSON.stringify(scoresR1, null, 2)}

YOUR REVISION DIRECTION TO THEM:
"${revisionPrompt}"

RECORDING 2 TRANSCRIPT:
"${transcriptR2}"

YOUR TASK:

1. SCORE Recording 2 using the same six-dimension rubric, with the same standards. Be consistent — do not inflate scores just because it's the second recording.

2. Write a CLOSURE narrative of 100-150 words for the user. Structure:
   - Open by naming the actual change you observed. Be specific. Quote both recordings if helpful.
   - Name what they did with the revision direction.
   - Close with a single, portable instruction — "what to carry forward" — that they can use today, outside Storied.

3. Generate a tomorrow_preview line (max 20 words): name what's coming tomorrow without spoiling it.

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
  "closure_narrative": "...",
  "carry_forward": "...",
  "tomorrow_preview": "..."
}

Do not include text outside the JSON.`;
}

export interface ComparisonResponse {
  scores: {
    clarity: number;
    structure: number;
    delivery: number;
    depth: number;
    impact: number;
    authenticity: number;
    overall: number;
  };
  closure_narrative: string;
  carry_forward: string;
  tomorrow_preview: string;
}
