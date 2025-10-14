import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
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