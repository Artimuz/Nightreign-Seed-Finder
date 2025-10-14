import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { applyRateLimit } from '@/lib/middleware/ratelimit';
import { sanitizeInput } from '@/lib/config/security';

const genericError = (message: string = 'Internal server error', status: number = 500) => 
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request: NextRequest) {
  try {

    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const { session_id } = body;

    if (!session_id || typeof session_id !== 'string') {
      return genericError('Invalid session ID', 400);
    }

    const sanitizedSessionId = sanitizeInput(session_id, 50);
    
    if (sanitizedSessionId) {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', sanitizedSessionId);
        
      if (error) {
        console.error('Database error during session cleanup:', error);
        return genericError('Cleanup failed', 500);
      }
    }
    
    return NextResponse.json({ success: true, message: 'Session cleaned up' });
  } catch (error) {
    console.error('Unexpected error in cleanup-session API:', error);
    return genericError();
  }
}