import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch events
export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('content_schedule')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ events });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Save a new schedule
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extract fields
    const { title, date, platform, notify, user_email, user_id } = body; 

    // 2. Validate user_id exists
    if (!title || !date || !user_id) { 
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 3. Insert into Database
    const { data, error } = await supabase
      .from('content_schedule')
      .insert({
        user_id, // <--- ADDED THIS (This was missing!)
        title,
        date,
        platform,
        notify, 
        status: 'pending',
        user_email
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('Save Error:', error);
    
    let message = 'An error occurred';
    if (error instanceof Error) message = error.message;
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove an event
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase
      .from('content_schedule')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}