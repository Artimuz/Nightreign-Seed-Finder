import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { isLocalhost, extractNightlordName } from '@/lib/utils/environment';
import { useGameStore } from '@/lib/state/store';
import seedData from '../../data/seed_data.json';

interface SeedData {
  seed_id: string;
  nightlord?: string;
}

export const useUserSession = () => {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { foundSeed, nightlord } = useGameStore();
  const generateSessionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const getCurrentNightlord = (): string | null => {
    if (foundSeed) {
      const seed = (seedData as SeedData[]).find((s) => s.seed_id === foundSeed);
      if (seed && seed.nightlord) {
        return extractNightlordName(seed.nightlord);
      }
    }
    if (pathname && pathname.includes('SEED=')) {
      const seedMatch = pathname.match(/SEED=([^&]+)/);
      if (seedMatch) {
        const seedId = seedMatch[1];
        const seed = (seedData as SeedData[]).find((s) => s.seed_id === seedId);
        if (seed && seed.nightlord) {
          return extractNightlordName(seed.nightlord);
        }
      }
    }
    if (nightlord) {
      return extractNightlordName(nightlord);
    }
    if (pathname && pathname.includes('nightlord=')) {
      const nightlordMatch = pathname.match(/nightlord=([^&]+)/);
      if (nightlordMatch) {
        return extractNightlordName(nightlordMatch[1]);
      }
    }
    return null;
  };
  const createSession = useCallback(async (pagePath: string) => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
    const nightlordName = getCurrentNightlord();
    try {
      await supabase
        .from('user_sessions')
        .upsert({
          session_id: sessionIdRef.current,
          page_path: pagePath,
          last_heartbeat: new Date().toISOString(),
          is_localhost: isLocalhost(),
          nightlord: nightlordName
        }, {
          onConflict: 'session_id'
        });
    } catch {
    }
  }, []);
  const updateHeartbeat = useCallback(async () => {
    if (!sessionIdRef.current) return;
    const nightlordName = getCurrentNightlord();
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          page_path: pathname,
          last_heartbeat: new Date().toISOString(),
          is_localhost: isLocalhost(),
          nightlord: nightlordName
        })
        .eq('session_id', sessionIdRef.current);
      if (error) {
        await createSession(pathname);
      }
    } catch {
    }
  }, [pathname, createSession]);
  const removeSession = useCallback(async () => {
    if (!sessionIdRef.current) return;
    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', sessionIdRef.current);
    } catch {
    }
  }, []);
  useEffect(() => {
    createSession(pathname);
    heartbeatIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateHeartbeat();
      }
    }, 10000);
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        navigator.sendBeacon('/api/cleanup-session', JSON.stringify({
          session_id: sessionIdRef.current
        }));
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateHeartbeat();
      }
    };
    const handleFocus = () => {
      updateHeartbeat();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pathname, createSession, updateHeartbeat]);
  useEffect(() => {
    if (sessionIdRef.current && nightlord) {
      updateHeartbeat();
    }
  }, [nightlord, updateHeartbeat]);
  return {
    sessionId: sessionIdRef.current
  };
};