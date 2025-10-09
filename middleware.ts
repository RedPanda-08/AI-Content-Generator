// File: middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // This line is the crucial fix: It refreshes the session on every request.
  await supabase.auth.getSession();

  // The rest of the logic remains the same.
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Update the matcher to protect all dashboard routes
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
  ],
};
