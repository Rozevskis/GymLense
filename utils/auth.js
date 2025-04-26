import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Get token from request
export async function getToken(req) {
  try {
    // For API routes, get token from cookies - using await with cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    return decoded;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(req) {
  const token = await getToken(req);
  return !!token;
}

// Get current user from token
export async function getCurrentUser(req) {
  const token = await getToken(req);
  return token ? token.id : null;
}
