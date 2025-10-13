import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();
    if (session_id) {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', session_id);
    }
    return NextResponse.json({ message: 'Session cleaned up' });
  } catch (error) {
    return NextResponse.json({ message: 'Cleanup attempted' });
  }
}