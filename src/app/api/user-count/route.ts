import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface UserSession {
  session_id: string;
  nightlord: string | null;
}

interface UserCountResponse {
  totalUsers: number;
  usersByNightlord: Record<string, number>;
}

interface NightlordCounts {
  [nightlord: string]: number;
}

function calculateActiveCutoffTime(): string {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  return new Date(fiveMinutesAgo).toISOString();
}

function processNightlordDistribution(sessions: UserSession[]): NightlordCounts {
  const nightlordCounts: NightlordCounts = {};
  
  sessions.forEach(session => {
    if (session.nightlord && typeof session.nightlord === 'string') {
      nightlordCounts[session.nightlord] = (nightlordCounts[session.nightlord] || 0) + 1;
    }
  });
  
  return nightlordCounts;
}

function createFallbackResponse(): UserCountResponse {
  return { totalUsers: 0, usersByNightlord: {} };
}

function createCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=120'
  };
}

export async function GET(): Promise<NextResponse<UserCountResponse>> {
  try {
    const activeCutoffTime = calculateActiveCutoffTime();
    
    const { data: activeUserSessions, error: databaseError } = await supabase
      .from('user_sessions')
      .select('session_id, nightlord')
      .gt('last_heartbeat', activeCutoffTime);

    if (databaseError) {
      console.warn('Supabase active users query failed:', databaseError);
      return NextResponse.json(createFallbackResponse());
    }

    if (!Array.isArray(activeUserSessions)) {
      return NextResponse.json(createFallbackResponse());
    }

    const validUserSessions = activeUserSessions as UserSession[];
    const totalActiveUsers = validUserSessions.length;
    const nightlordDistribution = processNightlordDistribution(validUserSessions);

    const responseData: UserCountResponse = {
      totalUsers: totalActiveUsers,
      usersByNightlord: nightlordDistribution,
    };

    const cacheHeaders = createCacheHeaders();

    return NextResponse.json(responseData, {
      headers: cacheHeaders
    });

  } catch (unexpectedError) {
    console.error('Error in user-count API:', unexpectedError);
    return NextResponse.json(
      createFallbackResponse(),
      { status: 500 }
    );
  }
}