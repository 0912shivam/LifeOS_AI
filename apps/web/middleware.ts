import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('lifeos-token')?.value;

  // If user is trying to access login/signup and has a token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is trying to access dashboard without a token, let the client-side check handle it
  // (dashboard layout will redirect to login)

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*']
};
