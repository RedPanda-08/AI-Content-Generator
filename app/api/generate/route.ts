import { createClient } from '@/lib/supabase/server'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const supabase = createClient(); 

  // Securely get the user using cookie-based session
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { brand_name, brand_tone, brand_keywords } = user.user_metadata ?? {};

  // Optional delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockText = 
`This is a mock AI response for the prompt: "${prompt}"

Settings Detected:
Brand Name: ${brand_name || 'Not set'}
Tone Used: ${brand_tone || 'Not set'}
Keywords: ${brand_keywords || 'Not set'}`;

  try {
    await supabase.from('generations').insert({
      user_id: user.id,
      prompt: prompt,
      content: mockText,
    });

    return NextResponse.json({ content: mockText });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to save to database." }, { status: 500 });
  }
}
