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

    // 5. Check Credits (MODIFIED LOGIC)
    const { data: creditData, error: creditError } = await supabase
      .from('credits')
      .select('count')
      .eq('user_id', user.id)
      .single<CreditData>();

    if (creditError || !creditData || creditData.count < 1) {
        // Determine if the user is a guest based on session metadata/user_metadata
        const isGuest = user.is_anonymous || user.user_metadata?.is_anonymous === true; 
        
        const error_code = isGuest ? 'TRIAL_EXHAUSTED' : 'CREDIT_EXHAUSTED';

      return NextResponse.json(
        { 
            error: error_code, // Returns the specific code for the front end
            message: 'You have no content tokens left.'
        }, 
        { status: 403 } // Use 403 Forbidden status
      );
    }

    // 6. Get User Prompt AND Platform
    const body = await request.json();
    const { prompt, platform = 'linkedin' } = body; // Default to linkedin if missing

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    // 7. Prepare Smart System Prompt
    // NOTE: Ensure is_anonymous flag is retrieved from user metadata if possible for consistency
    const { brand_name, brand_tone, brand_keywords } = (user.user_metadata ?? {}) as BrandMetadata;

    // Platform Logic Switch
    let platformRules = "";
    switch (platform.toLowerCase()) {
        case 'twitter':
            platformRules = "Format: A short, punchy tweet (max 280 chars). Use 2-3 relevant hashtags. Be conversational and direct.";
            break;
        case 'instagram':
            platformRules = "Format: An engaging visual caption. Use emojis to break up text. Add a block of 5-10 relevant hashtags at the bottom.";
            break;
        case 'linkedin':
        default:
            platformRules = "Format: A professional LinkedIn post. Use short paragraphs, bullet points for readability, and a clear call-to-action.";
            break;
    }

    const systemPrompt = `You are ContentAI, an expert social media strategist.
    
    BRAND IDENTITY:
    - Name: ${brand_name || "The User's Brand"}
    - Tone: ${brand_tone || "Professional and Engaging"}
    - Keywords: ${brand_keywords || "None provided"}

    TARGET PLATFORM: **${platform.toUpperCase()}**
    ${platformRules}

    WRITING RULES:
    1. Output ONLY the social media post content.
    2. Adapt tone to the platform requested.
    3. CRITICAL: If the user asks for non-marketing content (code, math, etc), politely decline.`;

    // 8. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 600, // Increased token limit for LinkedIn posts
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

    // 10. Save to History (Include Platform tag in prompt for clarity)
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