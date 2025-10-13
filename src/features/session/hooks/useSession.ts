import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SessionService } from '@/lib/services/sessionService';
import { useGameState } from '@/features/game/hooks/useGameState';

export const useSession = () => {
  const pathname = usePathname();
  const { state } = useGameState();
  const sessionService = SessionService.getInstance();

  const initializeSession = useCallback(async () => {
    await sessionService.createSession(pathname, state.nightlord);
    sessionService.startHeartbeat(pathname, state.nightlord);
  }, [pathname, state.nightlord]);

  const updateSession = useCallback(async () => {
    await sessionService.updateHeartbeat(pathname, state.nightlord);
  }, [pathname, state.nightlord]);

  useEffect(() => {
    initializeSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateSession();
      }
    };

    const handleFocus = () => {
      updateSession();
    };

    const handleBeforeUnload = () => {
      sessionService.cleanup();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      sessionService.stopHeartbeat();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [initializeSession, updateSession]);

  useEffect(() => {
    if (state.nightlord) {
      updateSession();
    }
  }, [state.nightlord, updateSession]);

  return {
    sessionId: sessionService.getSessionId(),
    updateSession,
  };
};