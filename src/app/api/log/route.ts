import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { checkRateLimit } from '@/lib/rateLimit';
interface LogRequestData {
  seed_id: string;
  timezone?: string;
  path_taken: Record<string, string>;
  additional_info: string;
  session_duration: number;
  Nightlord: string;
}
const genericError = (message: string = 'Internal server error', status: number = 500) => 
  NextResponse.json({ success: false, error: message }, { status });
function sanitizeInput(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[<>'"&`]/g, '')
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi, '')
    .replace(/(javascript:|data:|vbscript:|on\w+\s*=)/gi, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}
function validateSeedId(seedId: string): boolean {
  return /^[0-9]{3}$/.test(seedId);
}
function validateTimezone(timezone: string): boolean {
  return /^[A-Za-z]+\/[A-Za-z_]+$/.test(timezone) && timezone.length <= 50;
}
function validateNightlord(nightlord: string): boolean {
  return /^[A-Za-z]{1,20}$/.test(nightlord);
}
function validateMapType(mapType: string): boolean {
  const validMapTypes = ['normal', 'crater', 'mountaintop', 'noklateo', 'rotted'];
  return validMapTypes.includes(mapType);
}
function sanitizePathTaken(obj: unknown): Record<string, string> | null {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof key === 'string' && typeof value === 'string') {
      const cleanKey = sanitizeInput(key, 20);
      const cleanValue = sanitizeInput(value, 50);
      if (cleanKey.length > 0 && cleanValue.length > 0) {
        sanitized[cleanKey] = cleanValue;
      }
    }
  }
  const entries = Object.entries(sanitized);
  if (entries.length > 50) return null;
  return entries.length > 0 ? sanitized : null;
}
export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(request, 30000, 1)) {
      return genericError('Too many requests', 429);
    }
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10240) {
      return genericError('Request too large', 413);
    }
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return genericError('Invalid content type', 400);
    }
    let body: LogRequestData;
    try {
      body = await request.json();
    } catch {
      return genericError('Invalid JSON', 400);
    }
    if (!body || typeof body !== 'object') {
      return genericError('Invalid request body', 400);
    }
    if (!body.seed_id || typeof body.seed_id !== 'string' || !validateSeedId(body.seed_id)) {
      return genericError('Invalid seed_id format', 400);
    }
    if (body.timezone && (!validateTimezone(body.timezone))) {
      return genericError('Invalid timezone format', 400);
    }
    if (body.additional_info && (!validateMapType(body.additional_info))) {
      return genericError('Invalid map type', 400);
    }
    if (body.Nightlord && (!validateNightlord(body.Nightlord))) {
      return genericError('Invalid nightlord format', 400);
    }
    if (typeof body.session_duration !== 'number' || body.session_duration < 0 || body.session_duration > 86400) {
      return genericError('Invalid session duration', 400);
    }
    const logEntry = {
      seed_id: body.seed_id,
      timezone: body.timezone || null,
      bug_report: false,
      session_duration: Math.floor(body.session_duration),
      additional_info: body.additional_info ? { mapType: body.additional_info } : null,
      path_taken: sanitizePathTaken(body.path_taken),
      Nightlord: body.Nightlord || null,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('seedfinder_logs')
      .insert(logEntry);
    if (error) {
      return genericError('Database operation failed', 500);
    }
    return NextResponse.json({ success: true, data });
  } catch {
    return genericError();
  }
}
