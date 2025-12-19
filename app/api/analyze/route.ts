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

    // --- THE "SIMPLE & DIRECT" SYSTEM PROMPT ---
    const systemPrompt = `
    You are a helpful writing coach. Your job is to make the user's post better using VERY SIMPLE language.

    BRAND CONTEXT:
    - Brand Name: ${brand_name || 'The Brand'} 
    - Goal Tone: ${brand_tone || 'Bold'}
    - Keywords: ${brand_keywords || 'None'}

    RULES:
    1. **Keep it Short:** Use bullet points only. No long paragraphs.
    2. **Simple Words:** Write as if explaining to a friend. No complex jargon.
    3. **Be Specific:** Quote the bad part, then show the fixed part.

    OUTPUT FORMAT (Markdown):

    ### 👋 The Hook (First Sentence)
    - **Current:** "[Quote their hook]"
    - **Rating:** [Good / Bad]
    - **Why:** [1 short sentence explaining why]
    - **Try This:** "[A better, punchier version]"

    ### 🛠️ Quick Fixes
    - **"[Quote weak phrase]"** → Change to **"[Better word]"**.
    - **"[Quote boring part]"** → Rewrite as **"[Fun version]"**.

    ### 💡 Missing?
    - You forgot to include: [Call to Action / Question / Personal Story]. Add it at the end.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Critique this draft: "${contentToAnalyze}"` },
      ],
      temperature: 0.6, 
      max_tokens: 400, // Reduced tokens to force brevity
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