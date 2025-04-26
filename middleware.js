import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip NextAuth and public auth endpoints
  if (
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Protect custom API routes
  if (pathname.startsWith('/api/')) {
    const referer = request.headers.get('referer');
    const apiKey = request.headers.get('x-api-key');

    if (referer && new URL(referer).host === request.nextUrl.host) {
      return NextResponse.next();
    }

    if (apiKey && apiKey === process.env.API_KEY) {
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/profile/:path*'],
};
