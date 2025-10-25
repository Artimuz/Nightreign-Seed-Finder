import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const cutoffTime = new Date(Date.now() - 90 * 60 * 1000); // 90 minutes ago
    
    const deleteQuery = supabase
      .from('user_sessions')
      .delete()
      .lt('last_heartbeat', cutoffTime.toISOString());
    
    const { error } = await deleteQuery;
    
    if (error) {
      console.warn('Supabase cleanup failed:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in cleanup-old-sessions API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}