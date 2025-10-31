import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Early return for static assets
  if (request.nextUrl.pathname.match(/\.(webp|svg|ico|otf|webm|css|js)$/)) {
    return NextResponse.next();
  }

  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const isSeedResultPage = request.nextUrl.pathname.includes('SEED=');

  const response = NextResponse.next();
  
  // Lightweight processing for API routes to reduce CPU usage
  if (isApiRoute) {
    // Only set headers that aren't already in next.config.js
    return response;
  }
  
  // Full security processing for page routes
  // Skip redundant headers already set in next.config.js
  
  // CSRF protection for non-safe methods
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
  
  // Only generate request ID for API routes or seed pages
  if (isApiRoute || isSeedResultPage) {
    if (!response.headers.get('X-Request-ID')) {
      response.headers.set('X-Request-ID', crypto.randomUUID());
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next|favicon.ico|.*\\.(?:webp|svg|ico|otf|webm|css|js)$).*)',
  ],
};