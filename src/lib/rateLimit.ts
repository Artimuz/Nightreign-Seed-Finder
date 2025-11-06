import { NextRequest } from 'next/server';

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  const cutoff = now - 300000;
  
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.timestamp < cutoff) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

export function checkRateLimit(request: NextRequest, windowMs: number = 30000, maxRequests: number = 1): boolean {

  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  const clientId = `${ip}-${userAgent.substring(0, 50)}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const entry = rateLimitMap.get(clientId);
  
  if (!entry) {

    rateLimitMap.set(clientId, { timestamp: now, count: 1 });
    return true;
  }
  
  if (entry.timestamp < windowStart) {

    rateLimitMap.set(clientId, { timestamp: now, count: 1 });
    return true;
  }

  if (entry.count >= maxRequests) {

    return false;
  }

  entry.count++;
  return true;
}