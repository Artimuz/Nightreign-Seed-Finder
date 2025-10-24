import { useEffect, useRef, useCallback, useState } from 'react';
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
  const [lastPath, setLastPath] = useState<string>('');
  const [currentHeartbeatInterval, setCurrentHeartbeatInterval] = useState<number>(30000);
  const pathStableTimeRef = useRef<number>(Date.now());
  const lastHeartbeatTimeRef = useRef<number>(0);
  const pendingHeartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const rateLimitInterval = 10000;
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
      const sessionData = {
        session_id: sessionIdRef.current,
        page_path: pagePath,
        last_heartbeat: new Date().toISOString(),
        is_localhost: isLocalhost(),
        nightlord: nightlordName
      };
      
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', sessionIdRef.current);
        
      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionData);
        
      if (error) {
        console.warn('Session insert failed:', error);
      }
    } catch (error) {
      console.warn('Session creation failed:', error);
    }
  }, []);
  const calculateAdaptiveInterval = useCallback(() => {
    const baseInterval = 30000;
    const maxInterval = 180000;
    const incrementStep = 15000;
    
    if (pathname !== lastPath) {
      pathStableTimeRef.current = Date.now();
      setLastPath(pathname);
      setCurrentHeartbeatInterval(baseInterval);
      return baseInterval;
    }
    
    const timeStable = Date.now() - pathStableTimeRef.current;
    const intervals = Math.floor(timeStable / 60000);
    const newInterval = Math.min(baseInterval + (intervals * incrementStep), maxInterval);
    
    if (newInterval !== currentHeartbeatInterval) {
      setCurrentHeartbeatInterval(newInterval);
    }
    
    return newInterval;
  }, [pathname, lastPath, currentHeartbeatInterval]);

  const executeHeartbeat = useCallback(async () => {
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
      lastHeartbeatTimeRef.current = Date.now();
    } catch (error) {
    }
  }, [pathname, createSession]);

  const updateHeartbeat = useCallback(() => {
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
    
    if (pendingHeartbeatRef.current) {
      clearTimeout(pendingHeartbeatRef.current);
    }
    
    if (timeSinceLastHeartbeat >= rateLimitInterval) {
      executeHeartbeat();
    } else {
      const waitTime = rateLimitInterval - timeSinceLastHeartbeat;
      pendingHeartbeatRef.current = setTimeout(() => {
        executeHeartbeat();
        pendingHeartbeatRef.current = null;
      }, waitTime);
    }
  }, [executeHeartbeat, rateLimitInterval]);
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
  const setupAdaptiveHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearTimeout(heartbeatIntervalRef.current);
    }
    if (pendingHeartbeatRef.current) {
      clearTimeout(pendingHeartbeatRef.current);
    }
    
    const scheduleNextHeartbeat = () => {
      const interval = calculateAdaptiveInterval();
      const nextTime = new Date(Date.now() + interval).toLocaleTimeString();
      heartbeatIntervalRef.current = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          updateHeartbeat();
        }
        scheduleNextHeartbeat();
      }, interval);
    };
    
    scheduleNextHeartbeat();
  }, [calculateAdaptiveInterval, updateHeartbeat]);

  useEffect(() => {
    createSession(pathname);
    setupAdaptiveHeartbeat();
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
      setupAdaptiveHeartbeat();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      if (heartbeatIntervalRef.current) {
        clearTimeout(heartbeatIntervalRef.current);
      }
      if (pendingHeartbeatRef.current) {
        clearTimeout(pendingHeartbeatRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pathname, createSession, setupAdaptiveHeartbeat]);
  useEffect(() => {
    if (sessionIdRef.current && nightlord) {
      updateHeartbeat();
    }
  }, [nightlord, updateHeartbeat]);
  return {
    sessionId: sessionIdRef.current
  };
};