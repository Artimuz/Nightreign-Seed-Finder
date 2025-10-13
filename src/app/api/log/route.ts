import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { validateLogRequest } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/config/security';

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 });
    }

    const body = await request.json();
    const validation = validateLogRequest(body);
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed',
        details: validation.errors 
      }, { status: 400 });
    }

    const logEntry = {
      seed_id: sanitizeInput(validation.data!.seed_id, 100),
      timezone: validation.data!.timezone ? sanitizeInput(validation.data!.timezone, 50) : null,
      bug_report: validation.data!.bug_report,
      session_duration: Math.min(validation.data!.session_duration || 0, 86400),
      additional_info: validation.data!.additional_info,
      path_taken: validation.data!.path_taken,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('seedfinder_logs')
      .insert(logEntry);

    if (error) {
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}