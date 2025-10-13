import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
export async function POST(request: NextRequest) {
  try {
    const ninetyMinutesAgo = new Date(Date.now() - 5400000);
    const { data, error } = await supabase
      .from('user_sessions')
      .delete()
      .lt('last_heartbeat', ninetyMinutesAgo.toISOString());
    if (error) {
      return NextResponse.json({ error: 'Failed to cleanup sessions', details: error.message }, { status: 500 });
    }
    return NextResponse.json({
      message: 'Sessions cleaned up successfully',
      cutoffTime: ninetyMinutesAgo.toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}