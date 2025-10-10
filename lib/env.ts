// Environment variable validation and type safety

interface Environment {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

const getEnvVar = (name: keyof Environment, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value;
};

// Validate and export environment variables
export const env: Environment = {
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', ''),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
  NEXT_PUBLIC_APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Nightreign Seed Finder'),
  NEXT_PUBLIC_APP_VERSION: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
};

// Utility functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Supabase configuration check
export const hasSupabaseConfig = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);