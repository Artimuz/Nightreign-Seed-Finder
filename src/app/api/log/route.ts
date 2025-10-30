import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { validateLogRequest, LogRequestZodSchema } from '@/lib/validation/schemas';
import { sanitizeInput, sanitizeObject } from '@/lib/config/security';
import { applyRateLimit, applyLogApiRateLimit } from '@/lib/middleware/ratelimit';

const genericError = (message: string = 'Internal server error', status: number = 500) => 
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request: NextRequest) {
  try {
    // Apply 30-second rate limit for log API
    const logRateLimitResponse = await applyLogApiRateLimit(request);
    if (logRateLimitResponse) {
      return logRateLimitResponse;
    }

    // Apply general rate limit as secondary protection
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return genericError('Request too large', 413);
    }

    const body = await request.json();

    const zodValidation = LogRequestZodSchema.safeParse(body);
    if (!zodValidation.success) {
      console.error('Validation failed:', zodValidation.error.errors);
      return genericError('Invalid request data', 400);
    }

    const validation = validateLogRequest(body);
    if (!validation.isValid) {
      console.error('Legacy validation failed:', validation.errors);
      return genericError('Validation failed', 400);
    }

    const logEntry = {
      seed_id: sanitizeInput(zodValidation.data.seed_id, 100),
      timezone: zodValidation.data.timezone ? sanitizeInput(zodValidation.data.timezone, 50) : null,
      bug_report: zodValidation.data.bug_report || false,
      session_duration: Math.min(zodValidation.data.session_duration || 0, 86400),
      additional_info: zodValidation.data.additional_info ? sanitizeObject(zodValidation.data.additional_info) : null,
      path_taken: zodValidation.data.path_taken || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('seedfinder_logs')
      .insert(logEntry);

    if (error) {
      console.error('Database error:', error);
      return genericError('Database operation failed', 500);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error in log API:', error);
    return genericError();
  }
}