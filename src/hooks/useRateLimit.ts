import { useCallback, useEffect, useState } from 'react';

interface RateLimitState {
  lastCallTime: number;
  isBlocked: boolean;
}

const RATE_LIMIT_KEY = 'seedfinder_rate_limit';

export function useRateLimit(windowMs: number = 30000) {
  const [isBlocked, setIsBlocked] = useState(false);

  const getCurrentState = (): RateLimitState => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {

    }
    return { lastCallTime: 0, isBlocked: false };
  };

  const saveState = (state: RateLimitState): void => {
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    } catch {

    }
  };

  useEffect(() => {
    const state = getCurrentState();
    const now = Date.now();
    const timeSinceLastCall = now - state.lastCallTime;

    if (timeSinceLastCall >= windowMs) {

      const newState = { lastCallTime: 0, isBlocked: false };
      saveState(newState);
      setIsBlocked(false);
    } else {

      setIsBlocked(state.isBlocked);
    }
  }, [windowMs]);

  const canMakeRequest = useCallback((): boolean => {
    const state = getCurrentState();
    const now = Date.now();
    const timeSinceLastCall = now - state.lastCallTime;

    if (timeSinceLastCall >= windowMs) {

      const newState = { lastCallTime: 0, isBlocked: false };
      saveState(newState);
      setIsBlocked(false);
      return true;
    }

    const blocked = state.isBlocked;
    setIsBlocked(blocked);
    return !blocked;
  }, [windowMs]);

  const recordRequest = useCallback((): void => {
    const now = Date.now();
    const newState = { lastCallTime: now, isBlocked: true };
    saveState(newState);
    setIsBlocked(true);
  }, []);

  const getRemainingTime = useCallback((): number => {
    const state = getCurrentState();
    if (!state.isBlocked) return 0;
    
    const now = Date.now();
    const timeSinceLastCall = now - state.lastCallTime;
    const remaining = windowMs - timeSinceLastCall;
    
    return Math.max(0, remaining);
  }, [windowMs]);

  return {
    canMakeRequest,
    recordRequest,
    getRemainingTime,
    isBlocked
  };
}