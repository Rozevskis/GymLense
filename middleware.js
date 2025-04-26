import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Skip auth routes like /api/auth/*
  if (path.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Protect other API routes
  if (path.startsWith('/api/')) {
    const referer = request.headers.get('referer');
    const apiKey = request.headers.get('x-api-key');

    // Allow requests from our own frontend
    if (referer && new URL(referer).host === request.nextUrl.host) {
      return NextResponse.next();
    }

    // Allow requests with valid API key (for external services)
    if (apiKey === process.env.API_KEY) {
      return NextResponse.next();
    }

    // Block unauthorized requests
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Continue with normal request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
