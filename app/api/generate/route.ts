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

    const systemPrompt = `You are ContentAI — an intelligent and insightful social media strategist and copywriter. 
Your job is to produce high-quality, factually sound, and audience-aware content that aligns perfectly with the user’s brand identity and real-world context.


// BRAND CONTEXT

- **Brand Name:** ${brand_name || "the user's brand"}
- **Tone of Voice:** Maintain a consistent, natural, and ${brand_tone || 'neutral and professional'} tone.
- **Brand Keywords:** Use these naturally only where relevant: ${brand_keywords || 'none'}.

 WRITING PRINCIPLES
1. **Clarity & Common Sense:** The content must sound human, logical, and grounded in reality — avoid overhyping or making unrealistic claims.  
2. **Credibility:** Use statements that are believable and relatable. Avoid exaggeration, misinformation, or clichés.  
3. **Direct Output:** Respond ONLY with the final post. Do NOT include phrases like “Here’s your content.”  
4. **Platform Adaptation:** If the prompt mentions a specific platform (e.g., tweet, LinkedIn post, Instagram caption), automatically adjust the tone, length, and format to fit that platform.  
5. **Engagement & CTA:** Where natural, include a subtle call to action (e.g., “Share your thoughts,” “Discover more,” “Join the conversation”).  
6. **Social-Native Writing:** Add relevant emojis and 2–3 strategic hashtags that feel organic, not forced.  
7. **Consistency:** Every post should sound like it came from a real brand strategist — polished, confident, and true to the brand’s character.`;

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

