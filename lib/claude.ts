import Anthropic from '@anthropic-ai/sdk';
import { MASTER_SYSTEM_PROMPT_V1 } from './prompts/master-system';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SONNET = 'claude-sonnet-4-6';

function getMaxTokens(promptType: 'feedback' | 'comparison' | 'graduation'): number {
  const map = { feedback: 1500, comparison: 1000, graduation: 2000 };
  return map[promptType];
}

function getTemperature(promptType: 'feedback' | 'comparison' | 'graduation'): number {
  return promptType === 'graduation' ? 0.8 : 0.7;
}

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function callClaude<T>(
  userPrompt: string,
  promptType: 'feedback' | 'comparison' | 'graduation'
): Promise<T> {
  const model = SONNET;
  const maxTokens = getMaxTokens(promptType);
  const temperature = getTemperature(promptType);

  let response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: MASTER_SYSTEM_PROMPT_V1,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

  let parsed: T;
  try {
    parsed = JSON.parse(extractJson(rawText)) as T;
  } catch {
    // Retry once with stronger instruction
    response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: MASTER_SYSTEM_PROMPT_V1 + '\n\nYour previous response was not valid JSON. Return only the JSON object, with no surrounding text.',
      messages: [{ role: 'user', content: userPrompt }],
    });
    const retryText = response.content[0].type === 'text' ? response.content[0].text : '{}';
    parsed = JSON.parse(extractJson(retryText)) as T;
  }

  return parsed;
}

