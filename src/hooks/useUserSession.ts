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
  const lastHeartbeatTimeRef = useRef<number>(0); // Single rate limit for ALL heartbeats
  const lastHeartbeatUrlRef = useRef<string>(''); // Track last heartbeat URL to detect changes
  const queuedHeartbeatDataRef = useRef<{
    page_path: string;
    last_heartbeat: string;
    is_localhost: boolean;
    nightlord: string | null;
  } | null>(null); // Store the most recent heartbeat data
  const pendingHeartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isIdleRef = useRef<boolean>(false); // Track if current state is idle
  const creatingSessionRef = useRef<boolean>(false);
  const generateSessionId = () => {
    // Generate 32-character hexadecimal string as expected by validation schema
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  };
  const getCurrentNightlord = (): string | null => {
    
    // Priority 1: Always check for SEED in pathname first (most reliable source)
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
    
    // Priority 2: Check foundSeed from store (fallback)
    if (foundSeed) {
      const seed = (seedData as SeedData[]).find((s) => s.seed_id === foundSeed);
      if (seed && seed.nightlord) {
        const extracted = extractNightlordName(seed.nightlord);
        return extracted;
      }
    }
    
    // Priority 3: Explicit nightlord parameter in URL
    if (pathname && pathname.includes('nightlord=')) {
      const nightlordMatch = pathname.match(/nightlord=([^&]+)/);
      if (nightlordMatch) {
        const extracted = extractNightlordName(nightlordMatch[1]);
        return extracted;
      }
    }
    
    // Priority 4: Store nightlord (lowest priority)
    if (nightlord) {
      const extracted = extractNightlordName(nightlord);
      return extracted;
    }
    
    return null;
  };
  const createSession = useCallback(async () => {
    // 🚨 CRITICAL: Always use actual browser URL, not Next.js pathname (which might be truncated)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    
    // Prevent concurrent session creation
    if (creatingSessionRef.current) {
      return;
    }
    creatingSessionRef.current = true;
    
    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = generateSessionId();
      }
      
      // Get nightlord - validate against SEED if present
      let nightlordName: string | null = null;
      
      if (currentPath && currentPath.includes('SEED=')) {
        const seedMatch = currentPath.match(/SEED=([^&]+)/);
        if (seedMatch) {
          const seedId = seedMatch[1];
          const directSeed = (seedData as SeedData[]).find((s) => s.seed_id === seedId);
          if (directSeed && directSeed.nightlord) {
            const expectedNightlord = extractNightlordName(directSeed.nightlord);
            const currentNightlord = getCurrentNightlord();
            
            // VALIDATION: If they don't match, use the expected nightlord from seed data
            if (currentNightlord !== expectedNightlord) {
              // Silent correction - use seed data
            }
            
            nightlordName = expectedNightlord;
          } else {
            // Seed not found - abort session creation
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
      
      // Try update first, then insert if not exists (brings back the working 409 approach)
      const { data: updateData, error: updateError } = await supabase
        .from('user_sessions')
        .update(sessionData)
        .eq('session_id', sessionIdRef.current)
        .select();
        
      if (updateError || !updateData || updateData.length === 0) {
        // Update failed or no rows affected, try insert
        const { error: insertError } = await supabase
          .from('user_sessions')
          .insert(sessionData);
        
        // 409 errors (duplicate key) are expected and harmless
        if (insertError && insertError.code !== '23505') {
          // Silent error handling - real errors only
        }
      }
    } catch (error) {
      // Silent error handling
    } finally {
      creatingSessionRef.current = false;
    }
  }, []);
  const getCurrentAdaptiveInterval = useCallback(() => {
    // Just return the current interval without modifying it
    return currentHeartbeatInterval;
  }, [currentHeartbeatInterval]);

  const incrementAdaptiveInterval = useCallback(() => {
    const maxInterval = 180000;
    const incrementStep = 15000;
    
    // Increment the interval after a successful idle heartbeat
    setCurrentHeartbeatInterval(prevInterval => {
      const newInterval = Math.min(prevInterval + incrementStep, maxInterval);
      return newInterval;
    });
  }, []); // No dependencies needed with functional update

  const resetAdaptiveInterval = useCallback(() => {
    setCurrentHeartbeatInterval(30000);
  }, []);

  const executeHeartbeat = useCallback(async () => {
    if (!sessionIdRef.current) return;
    
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
    
    // SINGLE 20s rate limit for ALL heartbeats
    if (timeSinceLastHeartbeat < 20000) {
      // Rate limit not met, cannot send any heartbeat
      return;
    }
    
    try {
      // Use queued data if available, otherwise generate fresh data
      let heartbeatData;
      if (queuedHeartbeatDataRef.current) {
        heartbeatData = queuedHeartbeatDataRef.current;
        queuedHeartbeatDataRef.current = null; // Clear the queue
      } else {
        // Generate fresh heartbeat data (for idle heartbeats)
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
        // Don't create session immediately to avoid bypassing rate limit
      } else {
        // Heartbeat logging removed
      }
      lastHeartbeatTimeRef.current = Date.now();
      lastHeartbeatUrlRef.current = heartbeatData.page_path; // Update last heartbeat URL
      
      // Handle adaptive interval based on idle state
      if (!isIdleRef.current) {
        // URL changed - reset to 30s for next idle period
        resetAdaptiveInterval();
      } else {
        // Successfully sent idle heartbeat - increment interval for next time
        incrementAdaptiveInterval();
      }
    } catch (error) {
      // Silent error handling
    }
  }, [pathname, createSession]);

  const updateHeartbeat = useCallback(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const now = Date.now();
    const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
    
    // Determine if this is idle or active navigation
    const urlChanged = lastHeartbeatUrlRef.current !== currentUrl || lastHeartbeatUrlRef.current === '';
    isIdleRef.current = !urlChanged;
    
    // Always queue the most recent heartbeat data (overwriting any previous queued data)
    const currentNightlord = getCurrentNightlord();
    queuedHeartbeatDataRef.current = {
      page_path: currentUrl,
      last_heartbeat: new Date().toISOString(),
      is_localhost: isLocalhost(),
      nightlord: currentNightlord
    };
    
    // Clear any existing pending heartbeat
    if (pendingHeartbeatRef.current) {
      clearTimeout(pendingHeartbeatRef.current);
      pendingHeartbeatRef.current = null;
    }
    
    if (isIdleRef.current) {
      // IDLE = TRUE: Same URL, use adaptive 30s-180s rule
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
      // IDLE = FALSE: URL changed, use 20s rule
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
    // Clear existing idle heartbeat timer (but NOT pending rate-limited heartbeats)
    if (heartbeatIntervalRef.current) {
      clearTimeout(heartbeatIntervalRef.current);
    }
    
    const scheduleNextIdleHeartbeat = () => {
      const interval = getCurrentAdaptiveInterval();
      heartbeatIntervalRef.current = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          // Only send idle heartbeat if no queued data exists (user is truly idle)
          if (!queuedHeartbeatDataRef.current) {
            updateHeartbeat(); // Use the main updateHeartbeat logic which handles idle detection
          }
        }
        scheduleNextIdleHeartbeat();
      }, interval);
    };
    
    scheduleNextIdleHeartbeat();
  }, [getCurrentAdaptiveInterval, updateHeartbeat]);

  useEffect(() => {
    // Delay session creation to allow store to process URL first
    // This is especially important for URLs with SEED parameters
    const delayedSessionCreation = setTimeout(() => {
      // Create session first (this is what saves to database)
      const now = Date.now();
      const timeSinceLastHeartbeat = now - lastHeartbeatTimeRef.current;
      
      if (timeSinceLastHeartbeat >= 20000 || lastHeartbeatTimeRef.current === 0) {
        createSession();
        lastHeartbeatTimeRef.current = Date.now();
        lastHeartbeatUrlRef.current = pathname;
      }
    }, 100); // Small delay to let store process URL
    
    setupAdaptiveHeartbeat();
    
    // Return cleanup function that also clears the timeout
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