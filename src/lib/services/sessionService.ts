import { supabase } from '@/lib/supabaseClient';
import { generateSecureSessionId } from '@/lib/config/security';
import { validateSessionData, SessionZodSchema } from '@/lib/validation/schemas';
import { isLocalhost, extractNightlordName } from '@/lib/utils/environment';
import { measureAsync } from '@/lib/performance/monitoring';

export class SessionService {
  private static instance: SessionService;
  private sessionId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentHeartbeatDelay: number = 60000; // Start at 1 minute
  private lastActivityTime: number = Date.now();

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async createSession(pagePath: string, nightlord?: string | null): Promise<boolean> {
    // Session tracking disabled for performance optimization
    if (!this.sessionId) {
      this.sessionId = generateSecureSessionId();
    }
    return true;
  }

  async updateHeartbeat(pagePath: string, nightlord?: string | null): Promise<boolean> {
    // Heartbeat tracking disabled for performance optimization
    return true;
  }

  async removeSession(): Promise<boolean> {
    // Session removal disabled for performance optimization
    this.sessionId = null;
    return true;
  }

  startHeartbeat(pagePath: string, nightlord?: string | null): void {
    if (this.heartbeatInterval) {
      clearTimeout(this.heartbeatInterval);
    }

    // Reset heartbeat delay when starting fresh
    this.currentHeartbeatDelay = 60000; // 1 minute
    this.lastActivityTime = Date.now();

    const scheduleNextHeartbeat = () => {
      this.heartbeatInterval = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          const now = Date.now();
          const timeSinceActivity = now - this.lastActivityTime;
          
          // If user has been idle for more than current delay, increase delay
          if (timeSinceActivity >= this.currentHeartbeatDelay) {
            // Increase delay by 1 minute, max 10 minutes
            this.currentHeartbeatDelay = Math.min(this.currentHeartbeatDelay + 60000, 600000);
          } else {
            // Reset to 1 minute if there's been recent activity
            this.currentHeartbeatDelay = 60000;
            this.lastActivityTime = now;
          }
          
          this.updateHeartbeat(pagePath, nightlord);
        }
        scheduleNextHeartbeat();
      }, this.currentHeartbeatDelay);
    };

    scheduleNextHeartbeat();
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearTimeout(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    // Reset heartbeat delay when stopping
    this.currentHeartbeatDelay = 60000;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  trackActivity(): void {
    this.lastActivityTime = Date.now();
    // Reset to 1 minute delay on activity
    if (this.currentHeartbeatDelay > 60000) {
      this.currentHeartbeatDelay = 60000;
    }
  }

  cleanup(): void {
    this.stopHeartbeat();
  }
}