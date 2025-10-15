import { useState, useEffect, useCallback } from 'react';
import { sessionQueries } from '@/lib/database/queries';
import { measureAsync } from '@/lib/performance/monitoring';
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
  const cleanupOldSessions = async () => {
    await measureAsync('session_cleanup', async () => {
      try {
        const success = await sessionQueries.cleanupExpiredSessions();
        if (!success) {
          console.log('Session cleanup skipped (development mode or connection unavailable)');
        }
      } catch (error) {
        const errorMessage = error && typeof error === 'object' 
          ? JSON.stringify(error, null, 2) 
          : String(error || 'Unknown cleanup error');
        console.warn('Session cleanup failed:', errorMessage);
      }
    });
  };
  const fetchInitialData = useCallback(async () => {
    await measureAsync('user_counter_fetch', async () => {
      try {

        const [totalUsers, usersByNightlord] = await Promise.all([
          sessionQueries.getUserCount(),
          sessionQueries.getUsersByNightlord(),
        ]);

        setTotalUsers(totalUsers);
        setUsersByNightlord(usersByNightlord);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsConnected(false);
      }
    });
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