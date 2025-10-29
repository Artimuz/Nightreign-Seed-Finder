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
    return measureAsync('session_create', async () => {
      try {
        if (!this.sessionId) {
          this.sessionId = generateSecureSessionId();
        }

        const sessionData = {
          session_id: this.sessionId,
          page_path: pagePath,
          is_localhost: isLocalhost(),
          nightlord: nightlord ? extractNightlordName(nightlord) : null,
        };

        const zodValidation = SessionZodSchema.safeParse(sessionData);
        if (!zodValidation.success) {
          console.error('Session validation failed:', zodValidation.error.errors);
          return false;
        }

        const validation = validateSessionData(sessionData);
        if (!validation.isValid) {
          return false;
        }

        const finalSessionData = {
          ...validation.data,
          last_heartbeat: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('user_sessions')
          .update(finalSessionData)
          .eq('session_id', finalSessionData.session_id);
          
        if (updateError) {
          const { error: insertError } = await supabase
            .from('user_sessions')
            .insert(finalSessionData);
            
          if (insertError && insertError.code !== '23505') {
            console.warn('Session service insert failed:', insertError);
          }
        }

        return !updateError || updateError.code === '23505';
      } catch (error) {
        console.error('Session creation error:', error);
        return false;
      }
    });
  }

  async updateHeartbeat(pagePath: string, nightlord?: string | null): Promise<boolean> {
    if (!this.sessionId) return false;

    return measureAsync('session_heartbeat', async () => {
      try {
        const updateData = {
          page_path: pagePath,
          last_heartbeat: new Date().toISOString(),
          is_localhost: isLocalhost(),
          nightlord: nightlord ? extractNightlordName(nightlord) : null,
        };

        const { error } = await supabase
          .from('user_sessions')
          .update(updateData)
          .eq('session_id', this.sessionId);

        if (error) {
          console.warn('Heartbeat update failed, creating new session:', error);
          return await this.createSession(pagePath, nightlord);
        }

        return true;
      } catch (error) {
        console.error('Heartbeat error:', error);
        return false;
      }
    });
  }

  async removeSession(): Promise<boolean> {
    if (!this.sessionId) return true;

    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', this.sessionId);

      this.sessionId = null;
      return true;
    } catch {
      return false;
    }
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
    if (this.sessionId) {
      navigator.sendBeacon('/api/cleanup-session', JSON.stringify({
        session_id: this.sessionId
      }));
    }
  }
}