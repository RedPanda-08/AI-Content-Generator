import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface BrandMetadata {
  brand_name?: string;
  brand_tone?: string;
  brand_keywords?: string;
  is_anonymous?: boolean; 
}

interface CreditData {
  count: number;
}

interface GenerationRecord {
  user_id: string;
  prompt: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const cookieStore = await cookies();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please refresh the page.' }, { status: 401 });
    }

    const { data: creditData, error: creditError } = await supabase
      .from('credits')
      .select('count')
      .eq('user_id', user.id)
      .single<CreditData>();

    if (creditError || !creditData || creditData.count < 1) {
        const isGuest = user.is_anonymous || user.user_metadata?.is_anonymous === true; 
        const error_code = isGuest ? 'TRIAL_EXHAUSTED' : 'CREDIT_EXHAUSTED';

      return NextResponse.json(
        { 
            error: error_code, 
            message: 'You have no content tokens left.'
        }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { prompt, platform = 'linkedin' } = body; 

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    const { brand_name, brand_tone, brand_keywords } = (user.user_metadata ?? {}) as BrandMetadata;

    let platformRules = "";
    switch (platform.toLowerCase()) {
        case 'twitter':
            platformRules = `
            PLATFORM: TWITTER (X)
            - Format: A "hook" tweet followed by a short thread (if needed) or a single punchy statement.
            - Vibe: Contrarian, witty, fast-paced.
            - Rules: No hashtags in the middle of sentences. Max 1-2 hashtags at the end.
            `;
            break;
        case 'instagram':
            platformRules = `
            PLATFORM: INSTAGRAM
            - Format: A caption for a visual post.
            - Vibe: Storytelling, emotional, aesthetic.
            - Rules: Start with a "Stop the scroll" hook. The middle should tell a mini-story.
            - Hashtags: Include 5-10 relevant niche tags at the very bottom.
            `;
            break;
        case 'linkedin':
        default:
            platformRules = `
            PLATFORM: LINKEDIN
            - Format: A professional thought leadership post.
            - Structure: 
              1. Hook (1-2 lines maximum).
              2. Body (Group sentences into small paragraphs of 2-3 lines. DO NOT separate every single sentence with a newline).
              3. Conclusion/Takeaway.
            - Max 3 hashtags.
            `;
            break;
    }

    // --- THE UPDATED SYSTEM PROMPT ---
    const systemPrompt = `
    You are an elite Ghostwriter. You write human-sounding content, not "AI slop."

    BRAND IDENTITY:
    - Name: ${brand_name || "The Author"}
    - Voice: ${brand_tone || "Bold, Insightful, and Authentic"}
    - Keywords: ${brand_keywords || "Growth, Innovation, Leadership"}

    STRICT FORMATTING RULES (CRITICAL):
    1. **NO DOUBLE SPACING:** Do not put a blank line between every single sentence. Group related sentences into paragraphs.
    2. **NO POETRY MODE:** Write like a normal human speaks. Only use line breaks when shifting topics or for dramatic emphasis on the Hook.
    3. **BANNED WORDS:** Never use: "Unleash", "Unlock", "Delve", "Tapestry", "Game-changer", "In today's fast-paced world".
    4. **THE "PAIN POINT" STRATEGY:** Identify the user's underlying pain point, validate it, and offer a specific solution.

    ${platformRules}

    YOUR GOAL:
    Write a specific, high-value post based on the user's idea. Keep the formatting tight and professional.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is my rough idea: "${prompt}". Write a post about this.` },
      ],
      temperature: 0.7, // Lowered slightly to reduce "creative" formatting
      max_tokens: 800,
    });

    const aiContent = completion.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('Failed to generate content from AI.');
    }

    const { error: updateError } = await supabase
      .from('credits')
      .update({ count: creditData.count - 1 })
      .eq('user_id', user.id);

    if (updateError) {
        console.error("Error deducting credit:", updateError);
    }

    await supabase.from('generations').insert<GenerationRecord>({
      user_id: user.id,
      prompt: `[${platform}] ${prompt}`, 
      content: aiContent,
    });

    return NextResponse.json({ content: aiContent });

  } catch (error: unknown) {
    console.error('Generate Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}