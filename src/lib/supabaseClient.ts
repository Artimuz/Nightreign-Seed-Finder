import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getEnvironmentConfig } from '@/lib/config/environment';

interface MockQueryBuilder {
  upsert: (data: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{ data: null; error: null }>;
  insert: (data: Record<string, unknown>) => Promise<{ data: null; error: null }>;
  update: (data: Record<string, unknown>) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  select: (columns?: string) => Promise<{ data: Record<string, unknown>[]; error: null }>;
  eq: (column: string, value: unknown) => MockQueryBuilder;
  lt: (column: string, value: unknown) => MockQueryBuilder;
  then: (resolve: (value: { data: null; error: null }) => void) => void;
}

interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder;
  channel: (name: string) => {
    on: (event: string, callback: () => void) => MockSubscription;
    subscribe: () => string;
  };
  removeChannel: (channel: MockSubscription) => void;
}

interface MockSubscription {
  on: (event: string, callback: () => void) => MockSubscription;
  subscribe: () => string;
}

let supabase: SupabaseClient | MockSupabaseClient;

try {
  const config = getEnvironmentConfig();
  const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = config.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here') {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'X-Client-Info': 'nightreign-seed-finder@1.0.0',
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'X-Client-Info': 'nightreign-seed-finder@1.0.0',
              'Prefer': 'return=minimal',
              ...options.headers,
            },
          });
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } else {
    throw new Error('Supabase configuration missing or using placeholder values');
  }
} catch (error) {
  console.warn('Supabase client initialization failed, using mock client:', error);
  const mockQueryBuilder: MockQueryBuilder = {
    upsert: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: function() { return this; },
    delete: function() { return this; },
    select: () => Promise.resolve({ data: [], error: null }),
    eq: function() { return this; },
    lt: function() { return this; },
    then: (resolve) => resolve({ data: null, error: null })
  };
  
  supabase = {
    from: () => mockQueryBuilder,
    channel: () => ({
      on: function() { return this; },
      subscribe: () => 'CLOSED'
    }),
    removeChannel: () => {}
  };
}

export { supabase };