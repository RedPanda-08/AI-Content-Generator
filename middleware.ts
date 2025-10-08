// File: middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client that is safe to use in middleware
  const supabase = createMiddlewareClient({ req, res });

  // Get the session from the cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in and they are trying to access the dashboard...
  if (!session) {
    // ...redirect them to the login page.
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If they are signed in, allowed.
  return res;
}

//  middleware only runs on the dashboard page.
export const config = {
  matcher: '/dashboard',
};