import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
  }

  try {
    const { brand_name, brand_tone, brand_keywords } = user.user_metadata ?? {};

    const systemPrompt = `You are ContentAI, an expert social media strategist and copywriter. Your primary goal is to generate high-quality, engaging, and ready-to-publish content that perfectly matches the user's brand voice.

//-- BRAND CONTEXT --//
- **BRAND NAME:** ${brand_name || "the user's brand"}
- **TONE OF VOICE:** Your writing style must be strictly: **${brand_tone || 'neutral and professional'}**.
- **KEY KEYWORDS:** Where appropriate, naturally weave in these keywords: ${brand_keywords || 'none'}.

//-- CONTENT REQUIREMENTS --//
1.  **Direct Output:** Respond ONLY with the generated social media post. Do NOT include any extra text, explanations, or preambles like "Here is your post:".
2.  **Social Media Native:** Include relevant emojis and 2-3 strategic hashtags to maximize reach and engagement.
3.  **Platform Awareness:** If the user's prompt mentions a specific platform (e.g., "Write a tweet...", "Create a LinkedIn post..."), adapt the content's length, format, and tone accordingly.
4.  **Call to Action:** If it makes sense for the prompt, include a subtle call to action (e.g., "Learn more at...", "What are your thoughts?").`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiContent = completion.choices?.[0]?.message?.content;

    if (!aiContent) {
      return NextResponse.json(
        { error: 'Failed to generate content from AI.' },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase.from('generations').insert({
      user_id: user.id,
      prompt,
      content: aiContent,
    });

    if (dbError) {
      console.error('Database insertion error:', dbError);
    }

    return NextResponse.json({ content: aiContent });
  } catch (apiError) {
    console.error('OpenAI API error:', apiError);
    return NextResponse.json(
      { error: 'An error occurred while communicating with the AI service.' },
      { status: 500 }
    );
  }
}

