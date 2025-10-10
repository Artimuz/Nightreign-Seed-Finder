import { ApiResponse, BugReportData } from '../types';
import { handleApiError } from './errorHandler';

const API_BASE_URL = '/api';

// Generic API request handler
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const appError = handleApiError(error);
    return {
      success: false,
      error: appError.message,
      message: appError.message,
    };
  }
};

// Bug reporting API
export const submitBugReport = async (bugReport: BugReportData): Promise<ApiResponse> => {
  return apiRequest('/bug-report', {
    method: 'POST',
    body: JSON.stringify(bugReport),
  });
};

// Logging API (enhanced version of current log endpoint)
export const logUserAction = async (action: {
  type: string;
  data: any;
  timestamp?: string;
  sessionId?: string;
}): Promise<ApiResponse> => {
  return apiRequest('/log', {
    method: 'POST',
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...action,
    }),
  });
};

// Analytics API for future use
export const trackEvent = async (event: {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}): Promise<ApiResponse> => {
  return apiRequest('/analytics', {
    method: 'POST',
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...event,
    }),
  });
};