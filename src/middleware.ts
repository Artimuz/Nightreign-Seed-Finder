import { NextRequest, NextResponse } from 'next/server';
import { applyStatePageRateLimit } from '@/lib/middleware/ratelimit';

export async function middleware(request: NextRequest) {
  // Apply 30-second rate limit for state pages
  const isStatePage = request.nextUrl.pathname !== '/' && !request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/_next/');
  if (isStatePage) {
    const stateRateLimitResponse = await applyStatePageRateLimit(request);
    if (stateRateLimitResponse) {
      return stateRateLimitResponse;
    }
  }

  const response = NextResponse.next();
  
  // Lightweight processing for API routes to reduce CPU usage
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  
  if (isApiRoute) {
    // Minimal security headers for API routes
    if (!response.headers.get('X-Content-Type-Options')) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
    }
    return response;
  }
  
  // Full security processing for page routes
  if (!response.headers.get('X-Content-Type-Options')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  if (!response.headers.get('X-Frame-Options')) {
    response.headers.set('X-Frame-Options', 'DENY');
  }
  
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (process.env.NODE_ENV === 'production' && origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }
  
  if (!response.headers.get('X-Request-ID')) {
    response.headers.set('X-Request-ID', crypto.randomUUID());
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};