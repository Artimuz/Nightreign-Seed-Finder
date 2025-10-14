import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { applyRateLimit } from '@/lib/middleware/ratelimit';

const genericError = (message: string = 'Internal server error', status: number = 500) => 
  NextResponse.json({ success: false, error: message }, { status });

export async function POST(request: NextRequest) {
  try {

    const rateLimitResponse = await applyRateLimit(request, 'cleanup-sessions');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const ninetyMinutesAgo = new Date(Date.now() - 5400000);
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .lt('last_heartbeat', ninetyMinutesAgo.toISOString());
      
    if (error) {
      console.error('Database error during sessions cleanup:', error);
      return genericError('Failed to cleanup sessions', 500);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sessions cleaned up successfully',
      cutoffTime: ninetyMinutesAgo.toISOString()
    });
  } catch (error) {
    console.error('Unexpected error in cleanup-sessions API:', error);
    return genericError();
  }
}