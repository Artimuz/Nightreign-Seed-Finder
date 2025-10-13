import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | MockSupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
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