// app/api/refine-prompt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PromptRequest, RefineryResponse } from '@/types/dashboard';

export async function POST(request: NextRequest) {
  try {
    const body: PromptRequest = await request.json();
    const { prompt, useMock = true } = body;

    // --- MOCK LOGIC (Simulating AI) ---
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 1. If prompt is too short (means "Weak" Prompt)
      if (prompt.length < 15) {
        const response: RefineryResponse = {
          status: 'yellow',
          improved_prompt: `Act as a Founder. Write a viral LinkedIn post about "${prompt}". Use the 'Hook-Story-Lesson' framework.`,
          tags: ['Added Persona', 'Viral Framework', 'Expanded Context'],
          reason: 'Too vague. Added strategy & format.'
        };
        return NextResponse.json(response);
      }

      // 2. If prompt is good
      const validResponse: RefineryResponse = {
        status: 'green',
        improved_prompt: prompt,
        tags: ['Verified'],
        reason: 'Prompt looks great.'
      };
      return NextResponse.json(validResponse);
    }
    
    return NextResponse.json({ error: "No mock" }, { status: 500 });

  } catch (error) {
    console.error("Error in refine-prompt:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}