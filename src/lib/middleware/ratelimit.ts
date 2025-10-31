import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_CONFIG } from '@/lib/config/security';

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;
let statePagesRatelimit: Ratelimit | null = null;
let logApiRatelimit: Ratelimit | null = null;
let rateLimitersInitialized = false;

// Fallback in-memory rate limiting when Redis is not available
const inMemoryLimits = new Map<string, number>();

const isRateLimited = (key: string, windowMs: number): boolean => {
  const now = Date.now();
  const lastRequest = inMemoryLimits.get(key);
  
  if (!lastRequest || now - lastRequest >= windowMs) {
    inMemoryLimits.set(key, now);
    // Clean up old entries every 100 requests
    if (inMemoryLimits.size > 100) {
      const cutoff = now - windowMs * 2;
      for (const [k, v] of inMemoryLimits.entries()) {
        if (v < cutoff) inMemoryLimits.delete(k);
      }
    }
    return false;
  }
  return true;
};

// Lazy initialization of rate limiters
const initializeRateLimiters = () => {
  if (rateLimitersInitialized) return;
  
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
    rateLimitersInitialized = true;
  } catch (error) {
    console.warn('Rate limiting not available:', error);
    rateLimitersInitialized = true;
  }
};

export const applyRateLimit = async (request: NextRequest, identifier?: string): Promise<NextResponse | null> => {
  initializeRateLimiters();
  if (!ratelimit) {
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
  initializeRateLimiters();
  const id = identifier || getClientIP(request);
  
  // Fallback to in-memory rate limiting if Redis is not available
  if (!statePagesRatelimit) {
    const isLimited = isRateLimited(`state_${id}`, 30000); // 30 seconds
    if (isLimited) {
      return new NextResponse(
        'Rate limit exceeded. Please wait 30 seconds before accessing state pages again.',
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '1',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '30',
          },
        }
      );
    }
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
  initializeRateLimiters();
  const id = identifier || getClientIP(request);
  
  // Fallback to in-memory rate limiting if Redis is not available
  if (!logApiRatelimit) {
    const isLimited = isRateLimited(`log_${id}`, 30000); // 30 seconds
    if (isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait 30 seconds before submitting logs again.',
          limit: 1,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '1',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '30',
          },
        }
      );
    }
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