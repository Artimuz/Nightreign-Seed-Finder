
import { supabase } from '@/lib/supabaseClient';

const CACHE_TTL = {
  LOGS: 10 * 60 * 1000,
} as const;

class QueryCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  set(key: string, data: unknown, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const queryCache = new QueryCache();

if (typeof window !== 'undefined') {
  setInterval(() => queryCache.cleanup(), 5 * 60 * 1000);
}


export const logQueries = {
  async insertLog(logEntry: {
    seed_id: string;
    timezone?: string | null;
    bug_report?: boolean;
    session_duration?: number;
    additional_info?: Record<string, unknown> | null;
    path_taken?: Array<string[]> | null;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('seedfinder_logs')
        .insert({
          ...logEntry,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error inserting log:', error);
      return false;
    }
  },

  async getRecentLogs(limit: number = 100): Promise<unknown[]> {
    const cacheKey = `recent_logs_${limit}`;
    const cached = queryCache.get(cacheKey);
    if (cached !== null && Array.isArray(cached)) return cached;

    try {
      const query = supabase.from('seedfinder_logs').select('*');

      if ('order' in query) {
        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        const logs = data || [];
        queryCache.set(cacheKey, logs, CACHE_TTL.LOGS);
        return logs;
      } else {

        const logs: unknown[] = [];
        queryCache.set(cacheKey, logs, CACHE_TTL.LOGS);
        return logs;
      }
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return [];
    }
  },

  async getLogStats(): Promise<{
    totalLogs: number;
    bugReports: number;
    averageSessionDuration: number;
  }> {
    const cacheKey = 'log_stats';
    const cached = queryCache.get(cacheKey);
    if (cached !== null && typeof cached === 'object' && cached && 'totalLogs' in cached) {
      return cached as { totalLogs: number; bugReports: number; averageSessionDuration: number };
    }

    try {
      const { data, error } = await supabase
        .from('seedfinder_logs')
        .select('bug_report, session_duration');

      if (error) throw error;

      const stats = {
        totalLogs: data?.length || 0,
        bugReports: data?.filter(log => log.bug_report).length || 0,
        averageSessionDuration: data?.length 
          ? data.reduce((sum, log) => sum + (log.session_duration || 0), 0) / data.length
          : 0,
      };

      queryCache.set(cacheKey, stats, CACHE_TTL.LOGS);
      return stats;
    } catch (error) {
      console.error('Error fetching log stats:', error);
      return { totalLogs: 0, bugReports: 0, averageSessionDuration: 0 };
    }
  },
};

export const healthQueries = {
  async checkConnection(): Promise<boolean> {
    try {
      const query = supabase.from('seedfinder_logs').select('id');
      if ('limit' in query) {
        const { error } = await query.limit(1);
        return !error;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },

  async getTableSizes(): Promise<Record<string, number>> {
    try {
      const logsQuery = supabase.from('seedfinder_logs').select('*');
      
      if ('count' in logsQuery) {
        const logsResult = await supabase.from('seedfinder_logs').select('*', { count: 'exact', head: true });
        return {
          seedfinder_logs: (logsResult as { count?: number }).count || 0,
        };
      } else {
        return { seedfinder_logs: 0 };
      }
    } catch (error) {
      console.error('Error getting table sizes:', error);
      return { seedfinder_logs: 0 };
    }
  },
};