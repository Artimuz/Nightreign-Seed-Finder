import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_CONFIG } from '@/lib/config/security';

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;
let statePagesRatelimit: Ratelimit | null = null;
let logApiRatelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(
        SECURITY_CONFIG.API.RATE_LIMIT.MAX_REQUESTS,
        `${SECURITY_CONFIG.API.RATE_LIMIT.WINDOW_MS} ms`
      ),
      analytics: true,
      prefix: 'nightreign_api',
    });

    // 30-second rate limit for state pages (1 request per 30 seconds)
    statePagesRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(1, '30 s'),
      analytics: true,
      prefix: 'nightreign_state',
    });

    // 30-second rate limit for log API (1 request per 30 seconds)
    logApiRatelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(1, '30 s'),
      analytics: true,
      prefix: 'nightreign_log',
    });
  }
} catch (error) {
  console.warn('Rate limiting not available:', error);
}

export const applyRateLimit = async (request: NextRequest, identifier?: string): Promise<NextResponse | null> => {
  if (!ratelimit || process.env.NODE_ENV === 'development') {
    return null;
  }

  try {
    const id = identifier || getClientIP(request);
    const { success, limit, reset, remaining } = await ratelimit.limit(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          limit,
          reset: new Date(reset),
          remaining,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.round((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return null;
  }
};

const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  return 'unknown';
};

// 30-second rate limit for state pages
export const applyStatePageRateLimit = async (request: NextRequest, identifier?: string): Promise<NextResponse | null> => {
  if (!statePagesRatelimit || process.env.NODE_ENV === 'development') {
    return null;
  }

  try {
    const id = identifier || getClientIP(request);
    const { success, limit, reset, remaining } = await statePagesRatelimit.limit(id);

    if (!success) {
      return new NextResponse(
        'Rate limit exceeded. Please wait 30 seconds before accessing state pages again.',
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': '30',
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error('State page rate limiting error:', error);
    return null;
  }
};

// 30-second rate limit for log API
export const applyLogApiRateLimit = async (request: NextRequest, identifier?: string): Promise<NextResponse | null> => {
  if (!logApiRatelimit || process.env.NODE_ENV === 'development') {
    return null;
  }

  try {
    const id = identifier || getClientIP(request);
    const { success, limit, reset, remaining } = await logApiRatelimit.limit(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait 30 seconds before submitting logs again.',
          limit,
          reset: new Date(reset),
          remaining,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': '30',
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error('Log API rate limiting error:', error);
    return null;
  }
};

export { ratelimit };