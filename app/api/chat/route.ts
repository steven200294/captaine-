import { NextRequest } from 'next/server';
import { streamText, type UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { checkRateLimit } from '@shared/security/rate-limit';
import { retrieveContext } from '@api/services/chat/rag';
import { buildSystemPrompt } from '@api/services/chat/system-prompt';
import { createServiceClient } from '@shared/config/supabase-server';

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'general');
  if (rateLimited) return rateLimited;

  const body = await req.json();
  const { messages, sessionId } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Messages required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastUserMessage = extractLastUserText(messages);
  if (!lastUserMessage) {
    return new Response(JSON.stringify({ error: 'No user message found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contextChunks = await retrieveContext(lastUserMessage, 5);
  const systemPrompt = buildSystemPrompt(contextChunks);

  const modelMessages = convertToModelMessages(messages);

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 800,
    temperature: 0.7,
    onFinish: async ({ text }) => {
      persistSession(sessionId, messages, text).catch((err) =>
        console.error('[CHAT] Session persist error:', err.message)
      );
    },
  });

  return result.toUIMessageStreamResponse();
}

function extractLastUserText(messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }>; content?: string }>): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== 'user') continue;

    if (msg.parts) {
      const textPart = msg.parts.find((p) => p.type === 'text');
      if (textPart?.text) return textPart.text;
    }

    if (msg.content && typeof msg.content === 'string') return msg.content;
  }
  return null;
}

type ModelMessage = { role: 'user' | 'assistant' | 'system'; content: string };

function convertToModelMessages(messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }>; content?: string }>): ModelMessage[] {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((msg) => {
      let content = '';
      if (msg.parts) {
        content = msg.parts
          .filter((p) => p.type === 'text' && p.text)
          .map((p) => p.text!)
          .join('');
      } else if (msg.content) {
        content = msg.content;
      }
      return { role: msg.role as 'user' | 'assistant', content };
    })
    .filter((m) => m.content.length > 0);
}

async function persistSession(
  sessionId: string | undefined,
  messages: unknown[],
  assistantResponse: string
) {
  if (!sessionId) return;

  const supabase = createServiceClient();
  const allMessages = [
    ...messages,
    { role: 'assistant', content: assistantResponse },
  ];

  const { error } = await supabase
    .from('chat_sessions')
    .upsert(
      {
        session_token: sessionId,
        messages: allMessages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_token' }
    );

  if (error) {
    console.error('[CHAT] Persist error:', error.message);
  }
}
