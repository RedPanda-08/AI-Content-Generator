import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
            
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Cookie set error:', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
             
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Cookie remove error:', error);
            }
          },
        },
      }
    );

    // Exchange the auth code for a Supabase session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect user after successful login
  return NextResponse.redirect(`${requestUrl.origin}/auth/confirmed`);
}
