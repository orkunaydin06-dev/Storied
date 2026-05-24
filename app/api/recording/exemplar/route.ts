import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import Anthropic from '@anthropic-ai/sdk';
import { getDayContent } from '@/data/curriculum/days';

export const maxDuration = 60;

// Framework elements per week — used in the prompt and UI
const FRAMEWORK_ELEMENTS: Record<number, string[]> = {
  1: ['Beginning', 'Inciting Incident', 'Conflict', 'Recognition', 'Reversal', 'Emotional Release'],
  2: ['Once Upon a Time', 'Every Day', 'One Day', 'Because of That', 'Until Finally', 'Ever Since Then'],
  3: ['Call to Adventure', 'Refusal', 'Meeting the Mentor', 'Crossing the Threshold', 'The Ordeal', 'Return Changed'],
  4: ['Inventio', 'Dispositio', 'Elocutio', 'Movere'],
  5: ['Voice', 'Authenticity', 'Originality', 'Resonance'],
};

export type ExemplarSegment = {
  text: string;
  element: string;
  elementIndex: number;
};

export type AnnotatedExemplar = {
  segments: ExemplarSegment[];
  framework: string;
  elements: string[];
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { recordingId } = await req.json();
  if (!recordingId) return Response.json({ error: 'Missing recordingId' }, { status: 400 });

  const admin = createServiceRoleClient();

  const { data: recording } = await admin
    .from('recordings')
    .select('id, day_number, transcript, user_id, users(first_name)')
    .eq('id', recordingId)
    .eq('user_id', user.id)
    .single();

  if (!recording?.transcript) return Response.json({ error: 'No transcript' }, { status: 404 });

  const { data: fb } = await admin
    .from('feedback')
    .select('exemplar')
    .eq('recording_id', recordingId)
    .single();

  // Return cached exemplar if already generated
  if (fb?.exemplar) {
    try {
      const parsed = JSON.parse(fb.exemplar) as AnnotatedExemplar;
      return Response.json({ data: { exemplar: parsed } });
    } catch {
      // Legacy plain text — will re-generate below
    }
  }

  const day = getDayContent(recording.day_number);
  if (!day) return Response.json({ error: 'Day not found' }, { status: 404 });

  const usersData = recording.users as unknown as { first_name: string | null } | null;
  const firstName = usersData?.first_name ?? 'the storyteller';

  const elements = FRAMEWORK_ELEMENTS[day.week] ?? FRAMEWORK_ELEMENTS[1];

  const prompt = `Write an annotated exemplar story for ${firstName} using ${day.methodologyName}.

FRAMEWORK: ${day.methodologyName}
${day.methodologyAnchor}

THEIR ORIGINAL STORY:
"${recording.transcript}"

FRAMEWORK ELEMENTS TO USE:
${elements.map((e, i) => `${i + 1}. ${e}`).join('\n')}

YOUR TASK:
1. Write an ideal version of their story using this framework perfectly.
   - Use their actual story content, characters, events — do not invent new facts
   - Write in first person, as if you are them
   - Apply the framework: every beat must land
   - Add sensory detail and strong phrasing where they were vague
   - Total length: 150–250 words

2. Break the story into segments — each segment labeled with its framework element.
   - A segment can be 1–3 sentences
   - Every sentence must belong to a segment
   - Use each element at least once; elements can repeat if the story calls for it

OUTPUT FORMAT (strict JSON, no other text):
{
  "segments": [
    {"text": "...", "element": "Beginning", "elementIndex": 0},
    {"text": "...", "element": "Inciting Incident", "elementIndex": 1}
  ]
}

elementIndex must match the position in the elements list (0-based).`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 900,
    temperature: 0.75,
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';

  let segments: ExemplarSegment[] = [];
  try {
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    segments = parsed.segments ?? [];
  } catch {
    // Fallback: treat as plain text with a single segment
    segments = [{ text: rawText, element: elements[0], elementIndex: 0 }];
  }

  const annotated: AnnotatedExemplar = {
    segments,
    framework: day.methodologyName,
    elements,
  };

  await admin.from('feedback')
    .update({ exemplar: JSON.stringify(annotated) })
    .eq('recording_id', recordingId);

  return Response.json({ data: { exemplar: annotated } });
}
