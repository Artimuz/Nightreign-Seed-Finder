import { supabase } from '@/lib/supabaseClient';
import { generateSecureSessionId } from '@/lib/config/security';
import { validateSessionData, SessionZodSchema } from '@/lib/validation/schemas';
import { isLocalhost, extractNightlordName } from '@/lib/utils/environment';
import { measureAsync } from '@/lib/performance/monitoring';

export class SessionService {
  private static instance: SessionService;
  private sessionId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

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

        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_id', finalSessionData.session_id);
          
        const { error } = await supabase
          .from('user_sessions')
          .insert(finalSessionData);

        if (error) {
          console.warn('Session service insert failed:', error);
        }

        return !error;
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
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.updateHeartbeat(pagePath, nightlord);
      }
    }, 30000);
  }

  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
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