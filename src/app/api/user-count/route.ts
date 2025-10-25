import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    // Get total user count
    const userCountQuery = supabase
      .from('user_sessions')
      .select('session_id')
      .gt('last_heartbeat', cutoffTime);
    
    const { data: userCountData, error: userCountError } = await userCountQuery;

    if (userCountError) {
      console.warn('Supabase user count query failed:', userCountError);
      return NextResponse.json({ totalUsers: 0, usersByNightlord: {} });
    }

    // Get users by nightlord
    const nightlordQuery = supabase
      .from('user_sessions')
      .select('nightlord')
      .gt('last_heartbeat', cutoffTime);
    
    const { data: nightlordData, error: nightlordError } = await nightlordQuery;

    if (nightlordError) {
      console.warn('Supabase nightlord query failed:', nightlordError);
      return NextResponse.json({ 
        totalUsers: Array.isArray(userCountData) ? userCountData.length : 0, 
        usersByNightlord: {} 
      });
    }

    // Process nightlord counts
    const nightlordCounts: Record<string, number> = {};
    if (Array.isArray(nightlordData)) {
      nightlordData.forEach(session => {
        if (session.nightlord && typeof session.nightlord === 'string') {
          nightlordCounts[session.nightlord] = (nightlordCounts[session.nightlord] || 0) + 1;
        }
      });
    }

    return NextResponse.json({
      totalUsers: Array.isArray(userCountData) ? userCountData.length : 0,
      usersByNightlord: nightlordCounts,
    });

  } catch (error) {
    console.error('Error in user-count API:', error);
    return NextResponse.json(
      { totalUsers: 0, usersByNightlord: {} },
      { status: 500 }
    );
  }
}