import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. Define Types
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
    // 2. Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. Initialize Supabase (Cookie-Aware)
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
              // API routes are read-only for cookies
            }
          },
        },
      }
    );

    // 4. Validate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please refresh the page.' }, { status: 401 });
    }

    // 5. Check Credits
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

    // 6. Get User Prompt AND Platform
    const body = await request.json();
    const { prompt, platform = 'linkedin' } = body; 

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    // 7. Prepare Smart System Prompt (IMPROVED)
    const { brand_name, brand_tone, brand_keywords } = (user.user_metadata ?? {}) as BrandMetadata;

    let platformRules = "";
    switch (platform.toLowerCase()) {
        case 'twitter':
            platformRules = "Format: A single, high-impact tweet or a short thread (2 tweets max). Focus on a contrarian idea or a sharp insight. Max 1-2 hashtags.";
            break;
        case 'instagram':
            platformRules = "Format: A rich, storytelling caption. Start with a hook that stops the scroll. Focus on the visual description or the 'feeling' behind the topic. Max 3 hashtags.";
            break;
        case 'linkedin':
        default:
            platformRules = "Format: A thought-leadership post. Start with a counter-intuitive statement. Use short, punchy paragraphs. Focus on business lessons or personal growth. Max 3 hashtags.";
            break;
    }

    // --- THE "WOW FACTOR" SYSTEM PROMPT ---
    const systemPrompt = `
    You are an elite, award-winning Ghostwriter known for "stopping the scroll." You write for top CEOs and creative visionaries.
    You DO NOT write like a robot. You write like a human who thinks differently.

    BRAND CONTEXT:
    - Voice: ${brand_tone || "Bold, Insightful, and Authentic"}
    - Focus: ${brand_keywords || "Growth, Innovation, Leadership"}

    YOUR MISSION:
    Write a **${platform.toUpperCase()}** post about the user's topic.

    STRICT WRITING RULES:
    1. **NO CLICHÉS:** Banned words: "Unleash", "Unlock", "Delve", "Tapestry", "Game-changer", "In today's fast-paced world".
    2. **THE "WOW" FACTOR:** Find a unique angle. Don't just describe the topic; explain *why it matters* in a way nobody else has. Use metaphors. Be provocative.
    3. **HOOK FIRST:** The first sentence must be impossible to ignore.
    4. **LESS IS MORE:** Use 2-3 powerful hashtags max. The value is in the text, not the tags.
    5. **FORMATTING:** Use **bold** for emphasis. Use line breaks for readability. 
    6. **PLATFORM NATIVE:** ${platformRules}

    User Request: ${prompt}
    `;

    // 8. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85, // High creativity
      max_tokens: 700,
    });

    const aiContent = completion.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('Failed to generate content from AI.');
    }

    // 9. Deduct Credit
    const { error: updateError } = await supabase
      .from('credits')
      .update({ count: creditData.count - 1 })
      .eq('user_id', user.id);

    if (updateError) {
        console.error("Error deducting credit:", updateError);
    }

    // 10. Save to History
    await supabase.from('generations').insert<GenerationRecord>({
      user_id: user.id,
      prompt: `[${platform}] ${prompt}`, 
      content: aiContent,
    });

    // 11. Return Result
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