import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Check if it's an API request
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
    // Add protected routes here
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
