import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import Anthropic from '@anthropic-ai/sdk';
import { getDayContent } from '@/data/curriculum/days';

export const maxDuration = 60;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { recordingId } = await req.json();
  if (!recordingId) return Response.json({ error: 'Missing recordingId' }, { status: 400 });

  const admin = createServiceRoleClient();

  // Fetch recording + existing feedback
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
  if (fb?.exemplar) return Response.json({ data: { exemplar: fb.exemplar } });

  const day = getDayContent(recording.day_number);
  if (!day) return Response.json({ error: 'Day not found' }, { status: 404 });

  const usersData = recording.users as unknown as { first_name: string | null } | null;
  const firstName = usersData?.first_name ?? 'the storyteller';

  const prompt = `You are writing an exemplar version of a story told by ${firstName}.

FRAMEWORK IN FOCUS: ${day.methodologyName}
${day.methodologyAnchor}

THE QUESTION THEY ANSWERED:
${day.question}

THEIR ORIGINAL STORY (transcript):
"${recording.transcript}"

YOUR TASK:
Write a complete, ideal version of their story using this framework perfectly.

Rules:
- Use their actual story content, characters, and events — do not invent new facts
- Write in first person, as if you are them
- Apply the ${day.methodologyName} framework perfectly — make every beat land
- Add sensory detail, precise timing, and strong phrasing where their version was vague
- Length: 150–250 words (about 1.5–2 minutes at natural pace)
- This is the version they are working towards — make it compelling, specific, and moving
- Write the story directly. No preamble, no explanation, no title.

Output only the story text. No JSON. No formatting.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  const exemplar = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

  // Cache in DB
  await admin.from('feedback').update({ exemplar }).eq('recording_id', recordingId);

  return Response.json({ data: { exemplar } });
}
