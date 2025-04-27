import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token) {
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect index page based on auth state
  if (pathname === '/') {
    const token = request.cookies.get('token')?.value;
    const isAuth = token && await verifyToken(token);
    const target = isAuth ? '/dash/user' : '/signin';
    const url = new URL(target, request.url);
    return NextResponse.redirect(url);
  }

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/signin',
    '/api/auth/login',
    '/api/auth/register',
    '/_next',
    '/favicon.ico',
    '/arrow.svg',
    '/chevron.svg',
    '/logout.svg'
  ];
  
  // Protected paths that require authentication
  const protectedPaths = [
    '/dash/user',
    '/dash/ai-workout',
    '/ai-workout',
    '/dash/camera',
    '/dash/workout',
    '/dash/profile',
    '/api/user'
  ];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = token && await verifyToken(token);

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
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

  // Protect client routes that require authentication
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to signin page with the return URL
    const url = new URL('/signin', request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
