import { useState, useEffect, useCallback } from 'react';
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
  const fetchInitialData = useCallback(async () => {
    await measureAsync('user_counter_fetch', async () => {
      try {
        const response = await fetch('/api/user-count');
        if (!response.ok) {
          throw new Error(`API failed: ${response.statusText}`);
        }

        const data = await response.json();
        setTotalUsers(data.totalUsers || 0);
        setUsersByNightlord(data.usersByNightlord || {});
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsConnected(false);
      }
    });
  }, []);
  useEffect(() => {
    fetchInitialData();
    const quickRefreshTimeout = setTimeout(() => {
      fetchInitialData();
    }, 5000);
    const regularInterval = setInterval(() => {
      fetchInitialData();
    }, 900000);
    const channel = supabase.channel('user_sessions_changes');
    setIsConnected(false);
    return () => {
      clearTimeout(quickRefreshTimeout);
      clearInterval(regularInterval);
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