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
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>'"&]/g, (match) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    }[match] || match))
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
};

export const sanitizeObject = (obj: Record<string, unknown>, maxDepth: number = 3): Record<string, unknown> => {
  if (maxDepth <= 0) return {};
  
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeInput(key, 100);
    
    if (typeof value === 'string') {
      result[sanitizedKey] = sanitizeInput(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      result[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      result[sanitizedKey] = value
        .slice(0, 100)
        .map(item => typeof item === 'string' ? sanitizeInput(item) : item);
    } else if (value && typeof value === 'object') {
      result[sanitizedKey] = sanitizeObject(value as Record<string, unknown>, maxDepth - 1);
    }
  }
  
  return result;
};

export const validateApiInput = (data: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  return { isValid: errors.length === 0, errors };
};