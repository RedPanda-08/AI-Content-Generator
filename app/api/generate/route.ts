import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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

    // This is basic prompt engineering: we instruct the AI on how to behave.
    const systemPrompt = `You are an expert content creation assistant for a brand named "${
      brand_name || 'our brand'
    }". Your writing tone must be ${
      brand_tone || 'neutral'
    }. If relevant, naturally incorporate these keywords: ${
      brand_keywords || 'none'
    }. Respond directly to the user's prompt without preamble.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // A powerful and cost-effective model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7, // A good balance between creativity and predictability
      max_tokens: 500, // Limits the length of the response
    });

    const aiContent = response.choices[0].message.content;

    if (!aiContent) {
      return NextResponse.json(
        { error: 'Failed to generate content from AI.' },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase.from('generations').insert({
      user_id: user.id,
      prompt: prompt,
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