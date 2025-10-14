import { z } from 'zod';

export interface LogRequestSchema {
  seed_id: string;
  timezone?: string;
  bug_report?: boolean;
  session_duration?: number;
  additional_info?: Record<string, unknown>;
  path_taken?: Array<string[]>;
}

export const LogRequestZodSchema = z.object({
  seed_id: z.string()
    .min(1, 'Seed ID is required')
    .max(100, 'Seed ID too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Seed ID contains invalid characters'),
  timezone: z.string()
    .max(50, 'Timezone string too long')
    .regex(/^[a-zA-Z0-9/_+-]+$/, 'Invalid timezone format')
    .optional(),
  bug_report: z.boolean().optional(),
  session_duration: z.number()
    .min(0, 'Session duration cannot be negative')
    .max(86400, 'Session duration too long')
    .optional(),
  additional_info: z.record(z.unknown())
    .refine(
      (data) => JSON.stringify(data).length <= 10000,
      'Additional info too large'
    )
    .optional(),
  path_taken: z.array(z.array(z.string().max(200)))
    .max(1000, 'Path taken too large')
    .optional(),
});

export const SessionZodSchema = z.object({
  session_id: z.string()
    .length(32, 'Invalid session ID length')
    .regex(/^[a-f0-9]+$/, 'Invalid session ID format'),
  page_path: z.string()
    .min(1, 'Page path is required')
    .max(500, 'Page path too long')
    .regex(/^[a-zA-Z0-9/_.-]+$/, 'Invalid page path format'),
  is_localhost: z.boolean(),
  nightlord: z.string()
    .max(100, 'Nightlord name too long')
    .regex(/^[a-zA-Z0-9_-]*$/, 'Invalid nightlord name format')
    .nullable()
    .optional(),
});

export interface SessionSchema {
  session_id: string;
  page_path: string;
  last_heartbeat: string;
  is_localhost: boolean;
  nightlord?: string | null;
}

export const validateLogRequest = (data: unknown): { isValid: boolean; errors: string[]; data?: LogRequestSchema } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  const obj = data as Record<string, unknown>;
  
  if (!obj.seed_id || typeof obj.seed_id !== 'string') {
    errors.push('seed_id is required and must be a string');
  }
  
  if (obj.timezone && typeof obj.timezone !== 'string') {
    errors.push('timezone must be a string');
  }
  
  if (obj.bug_report !== undefined && typeof obj.bug_report !== 'boolean') {
    errors.push('bug_report must be a boolean');
  }
  
  if (obj.session_duration !== undefined && typeof obj.session_duration !== 'number') {
    errors.push('session_duration must be a number');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  return {
    isValid: true,
    errors: [],
    data: {
      seed_id: obj.seed_id as string,
      timezone: obj.timezone as string,
      bug_report: obj.bug_report as boolean || false,
      session_duration: obj.session_duration as number || 0,
      additional_info: (obj.additional_info as Record<string, unknown>) || null,
      path_taken: (obj.path_taken as Array<string[]>) || null,
    }
  };
};

export const validateSessionData = (data: unknown): { isValid: boolean; errors: string[]; data?: Partial<SessionSchema> } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  const obj = data as Record<string, unknown>;
  
  if (!obj.session_id || typeof obj.session_id !== 'string') {
    errors.push('session_id is required and must be a string');
  }
  
  if (!obj.page_path || typeof obj.page_path !== 'string') {
    errors.push('page_path is required and must be a string');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  return {
    isValid: true,
    errors: [],
    data: {
      session_id: obj.session_id as string,
      page_path: obj.page_path as string,
      last_heartbeat: new Date().toISOString(),
      is_localhost: Boolean(obj.is_localhost),
      nightlord: obj.nightlord as string || null,
    }
  };
};