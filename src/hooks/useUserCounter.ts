import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
interface UsersByPage {
  [pagePath: string]: number;
}
interface UsersByNightlord {
  [nightlord: string]: number;
}
export const useUserCounter = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersByPage, setUsersByPage] = useState<UsersByPage>({});
  const [usersByNightlord, setUsersByNightlord] = useState<UsersByNightlord>({});
  const [isConnected, setIsConnected] = useState(false);
  const calculateUserCounts = (sessions: Array<{
    last_heartbeat: string;
    is_localhost: boolean;
    page_path: string;
    nightlord?: string;
  }>) => {
    const now = new Date();
    const ninetyMinutesAgo = new Date(now.getTime() - 5400000);
    const activeSessions = sessions.filter(session =>
      new Date(session.last_heartbeat) > ninetyMinutesAgo
    );
    const nonLocalhostSessions = activeSessions.filter(session =>
      !session.is_localhost
    );
    const pageCount: UsersByPage = {};
    const nightlordCount: UsersByNightlord = {};
    activeSessions.forEach(session => {
      pageCount[session.page_path] = (pageCount[session.page_path] || 0) + 1;
      if (session.nightlord && !session.is_localhost) {
        nightlordCount[session.nightlord] = (nightlordCount[session.nightlord] || 0) + 1;
      }
    });
    const total = nonLocalhostSessions.length;
    setTotalUsers(total);
    setUsersByPage(pageCount);
    setUsersByNightlord(nightlordCount);
  };
  const cleanupOldSessions = async () => {
    try {
      await fetch('/api/cleanup-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
    }
  };
  const fetchInitialData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*');
      if (error) {
        return;
      }
      calculateUserCounts((data as Array<{
        last_heartbeat: string;
        is_localhost: boolean;
        page_path: string;
        nightlord?: string;
      }>) || []);
    } catch {
    }
  }, []);
  useEffect(() => {
    cleanupOldSessions().then(() => {
      fetchInitialData();
    });
    const quickRefreshTimeout = setTimeout(() => {
      fetchInitialData();
    }, 5000);
    const regularInterval = setInterval(() => {
      fetchInitialData();
    }, 60000);
    const cleanupInterval = setInterval(() => {
      cleanupOldSessions().then(() => {
        fetchInitialData();
      });
    }, 300000);
    const channel = supabase.channel('user_sessions_changes');
    setIsConnected(false);
    return () => {
      clearTimeout(quickRefreshTimeout);
      clearInterval(regularInterval);
      clearInterval(cleanupInterval);
      if (channel && 'unsubscribe' in channel) {
        try {
          channel.unsubscribe();
        } catch {
          // Silent fail for mock client
        }
      }
    };
  }, [fetchInitialData]);
  return {
    totalUsers,
    usersByPage,
    usersByNightlord,
    isConnected
  };
};