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
  const [currentHeartbeatInterval, setCurrentHeartbeatInterval] = useState<number>(30000);
  const lastHeartbeatTimeRef = useRef<number>(0);
  const lastHeartbeatUrlRef = useRef<string>('');
  const queuedHeartbeatDataRef = useRef<{
    page_path: string;
    last_heartbeat: string;
    is_localhost: boolean;
    nightlord: string | null;
  } | null>(null);
  const pendingHeartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isIdleRef = useRef<boolean>(false);
  const creatingSessionRef = useRef<boolean>(false);
  const generateSessionId = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  };
  const getCurrentNightlord = (): string | null => {
    
    if (pathname && pathname.includes('SEED=')) {
      const seedMatch = pathname.match(/SEED=([^&]+)/);
      if (seedMatch) {
        const seedId = seedMatch[1];
        const seed = (seedData as SeedData[]).find((s) => s.seed_id === seedId);
        if (seed && seed.nightlord) {
          const extracted = extractNightlordName(seed.nightlord);
          return extracted;
        }
      }
    }
    
    if (foundSeed) {
      const seed = (seedData as SeedData[]).find((s) => s.seed_id === foundSeed);
      if (seed && seed.nightlord) {
        const extracted = extractNightlordName(seed.nightlord);
        return extracted;
      }
    }
    
    if (pathname && pathname.includes('nightlord=')) {
      const nightlordMatch = pathname.match(/nightlord=([^&]+)/);
      if (nightlordMatch) {
        const extracted = extractNightlordName(nightlordMatch[1]);
        return extracted;
      }
    }
    
    if (nightlord) {
      const extracted = extractNightlordName(nightlord);
      return extracted;
    }
    
    return null;
  };
  const createSession = useCallback(async () => {

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    
    if (creatingSessionRef.current) {
      return;
    }
    creatingSessionRef.current = true;
    
    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = generateSessionId();
      }
      
      let nightlordName: string | null = null;
      
      if (currentPath && currentPath.includes('SEED=')) {
        const seedMatch = currentPath.match(/SEED=([^&]+)/);
        if (seedMatch) {
          const seedId = seedMatch[1];
          const directSeed = (seedData as SeedData[]).find((s) => s.seed_id === seedId);
          if (directSeed && directSeed.nightlord) {
            const expectedNightlord = extractNightlordName(directSeed.nightlord);
            const currentNightlord = getCurrentNightlord();
            
            if (currentNightlord !== expectedNightlord) {

            }
            
            nightlordName = expectedNightlord;
          } else {

            creatingSessionRef.current = false;
            return;
          }
        }
      } else {
        nightlordName = getCurrentNightlord();
      }
      
      const sessionData = {
        session_id: sessionIdRef.current,
        page_path: currentPath,
        last_heartbeat: new Date().toISOString(),
        is_localhost: isLocalhost(),
        nightlord: nightlordName
      };
      
      const { data: updateData, error: updateError } = await supabase
        .from('user_sessions')
        .update(sessionData)
        .eq('session_id', sessionIdRef.current)
        .select();
        
      if (updateError || !updateData || updateData.length === 0) {

        const { error: insertError } = await supabase
          .from('user_sessions')
          .insert(sessionData);
        
        if (insertError && insertError.code !== '23505') {

        }
      }
    } catch (error) {

    } finally {
      creatingSessionRef.current = false;
    }
  }, []);
  const getCurrentAdaptiveInterval = useCallback(() => {

    return currentHeartbeatInterval;
  }, [currentHeartbeatInterval]);

  const incrementAdaptiveInterval = useCallback(() => {
    const maxInterval = 180000;
    const incrementStep = 15000;
    
    setCurrentHeartbeatInterval(prevInterval => {
      const newInterval = Math.min(prevInterval + incrementStep, maxInterval);
      return newInterval;
    });
  }, []);

  const resetAdaptiveInterval = useCallback(() => {
    setCurrentHeartbeatInterval(30000);
  }, []);

  const executeHeartbeat = useCallback(async () => {
    if (!sessionIdRef.current) return;
    
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
    
    if (timeSinceLastHeartbeat < 20000) {

      return;
    }
    
    try {

      let heartbeatData;
      if (queuedHeartbeatDataRef.current) {
        heartbeatData = queuedHeartbeatDataRef.current;
        queuedHeartbeatDataRef.current = null;
      } else {

        const currentNightlord = getCurrentNightlord();
        heartbeatData = {
          page_path: typeof window !== 'undefined' ? window.location.pathname : pathname,
          last_heartbeat: new Date().toISOString(),
          is_localhost: isLocalhost(),
          nightlord: currentNightlord
        };
      }
      
      const { error } = await supabase
        .from('user_sessions')
        .update(heartbeatData)
        .eq('session_id', sessionIdRef.current);
        
      if (error) {

      } else {

      }
      lastHeartbeatTimeRef.current = Date.now();
      lastHeartbeatUrlRef.current = heartbeatData.page_path;
      
      if (!isIdleRef.current) {

        resetAdaptiveInterval();
      } else {

        incrementAdaptiveInterval();
      }
    } catch (error) {

    }
  }, [pathname, createSession]);

  const updateHeartbeat = useCallback(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
    
    const urlChanged = lastHeartbeatUrlRef.current !== currentUrl || lastHeartbeatUrlRef.current === '';
    isIdleRef.current = !urlChanged;
    
    const currentNightlord = getCurrentNightlord();
    queuedHeartbeatDataRef.current = {
      page_path: currentUrl,
      last_heartbeat: new Date().toISOString(),
      is_localhost: isLocalhost(),
      nightlord: currentNightlord
    };
    
    if (pendingHeartbeatRef.current) {
      clearTimeout(pendingHeartbeatRef.current);
      pendingHeartbeatRef.current = null;
    }
    
    if (isIdleRef.current) {

      const adaptiveInterval = getCurrentAdaptiveInterval();
      if (timeSinceLastHeartbeat >= adaptiveInterval) {
        executeHeartbeat();
      } else {
        const waitTime = adaptiveInterval - timeSinceLastHeartbeat;
        pendingHeartbeatRef.current = setTimeout(() => {
          executeHeartbeat();
          pendingHeartbeatRef.current = null;
        }, waitTime);
      }
    } else {

      if (timeSinceLastHeartbeat >= 20000 || lastHeartbeatTimeRef.current === 0) {
        executeHeartbeat();
      } else {
        const waitTime = 20000 - timeSinceLastHeartbeat;
        pendingHeartbeatRef.current = setTimeout(() => {
          executeHeartbeat();
          pendingHeartbeatRef.current = null;
        }, waitTime);
      }
    }
  }, [executeHeartbeat, pathname]);
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
    
    const scheduleNextIdleHeartbeat = () => {
      const interval = getCurrentAdaptiveInterval();
      heartbeatIntervalRef.current = setTimeout(() => {
        if (document.visibilityState === 'visible') {

          if (!queuedHeartbeatDataRef.current) {
            updateHeartbeat();
          }
        }
        scheduleNextIdleHeartbeat();
      }, interval);
    };
    
    scheduleNextIdleHeartbeat();
  }, [getCurrentAdaptiveInterval, updateHeartbeat]);

  useEffect(() => {

    const delayedSessionCreation = setTimeout(() => {

      const now = Date.now();
      const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
      
      if (timeSinceLastHeartbeat >= 20000 || lastHeartbeatTimeRef.current === 0) {
        createSession();
        lastHeartbeatTimeRef.current = Date.now();
        lastHeartbeatUrlRef.current = pathname;
      }
    }, 100);
    
    setupAdaptiveHeartbeat();
    
    const originalCleanup = () => {
      clearTimeout(delayedSessionCreation);
    };
    
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
      originalCleanup();
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
    if (sessionIdRef.current) {
      updateHeartbeat();
    }
  }, [pathname, updateHeartbeat]);

  useEffect(() => {
    if (sessionIdRef.current && nightlord) {
      updateHeartbeat();
    }
  }, [nightlord, updateHeartbeat]);
  return {
    sessionId: sessionIdRef.current
  };
};