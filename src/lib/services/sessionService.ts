import { supabase } from '@/lib/supabaseClient';
import { generateSecureSessionId } from '@/lib/config/security';
import { validateSessionData, SessionSchema } from '@/lib/validation/schemas';
import { isLocalhost, extractNightlordName } from '@/lib/utils/environment';

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

      const validation = validateSessionData(sessionData);
      if (!validation.isValid) {
        return false;
      }

      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          ...validation.data,
          last_heartbeat: new Date().toISOString(),
        }, {
          onConflict: 'session_id'
        });

      return !error;
    } catch {
      return false;
    }
  }

  async updateHeartbeat(pagePath: string, nightlord?: string | null): Promise<boolean> {
    if (!this.sessionId) return false;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          page_path: pagePath,
          last_heartbeat: new Date().toISOString(),
          is_localhost: isLocalhost(),
          nightlord: nightlord ? extractNightlordName(nightlord) : null,
        })
        .eq('session_id', this.sessionId);

      if (error) {
        return await this.createSession(pagePath, nightlord);
      }

      return true;
    } catch {
      return false;
    }
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