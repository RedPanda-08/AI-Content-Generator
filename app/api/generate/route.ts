// File: app/api/generate/route.ts (Smarter Mock Version)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt, tone } = await req.json(); // Now receives the 'tone'
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- NEW LOGIC START ---
  // Fetch the user's saved Brand Voice from their metadata
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const { brand_name, brand_tone, brand_keywords } = user.user_metadata ?? {};

  // Determine which tone to use based on the user's selection
  const finalTone = (tone && tone !== 'Default (from settings)') 
    ? tone 
    : (brand_tone || 'Not set');
  // --- NEW LOGIC END ---


  // Simulate a 1.5-second delay to feel like a real API call
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // --- UPDATED MOCK RESPONSE ---
  // This new response is "smart" and shows the settings it used.
  const mockText = 
`This is a mock AI response for the prompt: "${prompt}"

Settings Detected:
Brand Name: ${brand_name || 'Not set'}
Tone Used: ${finalTone}
Keywords: ${brand_keywords || 'Not set'}

This confirms that the data from your settings page and the tone selector are correctly being sent to the backend.`;
  
  try {
    await supabase.from('generations').insert({
      user_id: session.user.id,
      prompt: prompt,
      content: mockText,
    });

    return NextResponse.json({ content: mockText });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to save to database." }, { status: 500 });
  }
}

