import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { contentToAnalyze } = await req.json();
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!contentToAnalyze) {
    return NextResponse.json(
      { error: 'No content provided for analysis.' },
      { status: 400 }
    );
  }


  try {
    const { brand_name, brand_tone, brand_keywords } = user.user_metadata ?? {};

    // This prompt instructs the AI to act as a content strategist.
    const systemPrompt = `You are an expert content strategist for the brand named "${
      brand_name || 'our brand'
    }". Your goal is to provide actionable feedback on the user's provided text.
The feedback should help them align the content with their brand's tone, which is: "${
      brand_tone || 'neutral'
    }".
Suggest how they could better incorporate their keywords: "${
      brand_keywords || 'none'
    }".
Structure your response in clear, concise markdown bullet points. Focus on suggesting improvements for Readability, Engagement, and SEO.`;

   
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please analyze this content: "${contentToAnalyze}"` },
      ],
      temperature: 0.5, 
      max_tokens: 400,
    });

    const aiAnalysis = response.choices[0].message.content;

    if (!aiAnalysis) {
      return NextResponse.json(
        { error: 'Failed to get an analysis from the AI.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis: aiAnalysis });
  } catch (apiError) {
    console.error('OpenAI API error:', apiError);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the content.' },
      { status: 500 }
    );
  }
}