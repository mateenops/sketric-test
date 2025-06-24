// File: app/api/chat-sse/route.ts
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge'; // Enable streaming on Vercel Edge Functions

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input');
  const instructions = searchParams.get('instructions') || 'You are the Sketric AI Assistant...';

  if (!input) {
    return new Response('Missing input', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await openai.responses.create({
          model: 'gpt-4.1',
          instructions,
          input,
          stream: true,
        });

        for await (const chunk of response) {
          const delta = (chunk as any)?.text || '';
          controller.enqueue(`data: ${JSON.stringify({ delta })}\n\n`);
        }

        controller.enqueue(`event: end\ndata: done\n\n`);
        controller.close();
      } catch (err: Error | any) {
        controller.enqueue(`event: error\ndata: ${JSON.stringify({ message: err.message || 'Unknown error' })}\n\n`);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
