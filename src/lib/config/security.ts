export const SECURITY_CONFIG = {
  SESSION: {
    ID_LENGTH: 32,
    HEARTBEAT_INTERVAL: 30000,
    MAX_SESSION_DURATION: 24 * 60 * 60 * 1000,
  },
  API: {
    MAX_REQUEST_SIZE: 1024 * 1024,
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX_REQUESTS: 100,
    },
  },
  INPUT: {
    MAX_STRING_LENGTH: 500,
    ALLOWED_CHARACTERS: /^[a-zA-Z0-9_\-=&.]+$/,
  },
};

export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(SECURITY_CONFIG.SESSION.ID_LENGTH / 2);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const sanitizeInput = (input: string, maxLength: number = SECURITY_CONFIG.INPUT.MAX_STRING_LENGTH): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .slice(0, maxLength)
    .replace(/[<>'"&]/g, '')
    .trim();
};

export const validateApiInput = (data: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  return { isValid: errors.length === 0, errors };
};