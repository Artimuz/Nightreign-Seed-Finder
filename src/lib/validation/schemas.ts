export interface LogRequestSchema {
  seed_id: string;
  timezone?: string;
  bug_report?: boolean;
  session_duration?: number;
  additional_info?: Record<string, unknown>;
  path_taken?: Array<string[]>;
}

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