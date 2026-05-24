import type { DayContent } from '@/data/curriculum/days';

export function buildFeedbackPrompt(
  day: DayContent,
  userName: string,
  transcript: string,
  durationSeconds: number
): string {
  return `The user just completed Recording 1 of Storied — a daily storytelling practice.

CONTEXT FOR THIS DAY:
- Day number: ${day.day} of 30
- Week: ${day.week} of 5
- Week theme: ${day.weekTheme}
- Methodology in focus: ${day.methodologyName}
- Methodology system anchor: ${day.methodologyAnchor}

THE QUESTION THEY ANSWERED:
${day.question}

THE MINI-TEACHING THEY READ:
${day.miniTeaching}

USER'S NAME: ${userName}

THEIR RECORDING (transcript via Whisper):
"${transcript}"

Recording duration: ${durationSeconds} seconds
Target duration this week: ${day.targetSeconds} seconds

PRE-WRITTEN REVISION EXAMPLE OPENINGS (choose 2-3 that best address their specific weakness, use verbatim):
1. "${day.revisionExamples[0]}"
2. "${day.revisionExamples[1]}"
3. "${day.revisionExamples[2]}"

YOUR TASK:
Provide feedback in this exact structure:

1. SCORES — score this recording on six dimensions, each 0-100:
   - Clarity
   - Structure
   - Delivery
   - Depth
   - Impact
   - Authenticity

   Use the rubric criteria. Be honest. Be strict — especially on Authenticity. First recordings rarely score above 75 overall.

2. NARRATIVE FEEDBACK — write 150-250 words in Storied's voice.

   Structure:
   - Open by naming what landed. What's real. What's working.
   - Then name what's missing or weak. Quote their exact words.
   - Reference the day's methodology only if it sharpens the point.
   - Close with a single, concrete direction.

   Use the user's name once, naturally, near the opening.

3. STRUCTURE BREAKDOWN — give a specific check on the day's framework.
   For Week 1 (Aristotle), this is: Beginning / Middle / End status.
   For Week 2 (Pixar), this is: which Spine beats are present.
   For Week 3 (Campbell), this is: which Journey stages are present.
   For Week 4 (Cicero), this is: which canons are working.
   For Week 5 (Synthesis), this is: voice notes — what's still imitating, what's becoming theirs.

   For each element, include both:
   - "note": analytical observation about what was or wasn't present (as before)
   - "revision_tip": one concrete action they can take in Recording 2 for this element. Start with a verb. Be specific. Example: "Open with the exact moment the problem hit — not background." Maximum 2 sentences.

4. REVISION PROMPT — after your narrative, add a revision section formatted exactly as:

Your micro-revision for Recording 2:

[One specific instruction, 1-2 sentences]

Try something like:

• [Example opening 1 — choose from pre-written examples above, verbatim]
• [Example opening 2]
• [Optional example 3]

[Optional: a second instruction, 1 sentence]

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
  "narrative": "...",
  "revision_prompt": "...",
  "structure_breakdown": {
    "framework": "...",
    "elements": [
      { "name": "...", "status": "...", "score": "...", "note": "...", "revision_tip": "..." }
    ]
  }
}

Calculate the overall score using:
Overall = (Clarity * 0.15) + (Structure * 0.20) + (Delivery * 0.10) + (Depth * 0.20) + (Impact * 0.20) + (Authenticity * 0.15)

Round to nearest integer.

Do not include any text outside the JSON.`;
}

export interface FeedbackResponse {
  scores: {
    clarity: number;
    structure: number;
    delivery: number;
    depth: number;
    impact: number;
    authenticity: number;
    overall: number;
  };
  narrative: string;
  revision_prompt: string;
  structure_breakdown: {
    framework: string;
    elements: Array<{ name: string; status: string; score: string; note: string; revision_tip?: string }>;
  };
  edge_case?: string;
}
