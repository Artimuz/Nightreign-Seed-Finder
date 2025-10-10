import { useCallback } from 'react';
import { AppError, BugReportData } from '../types';
import { createError, logError } from '../utils/errorHandler';
import { submitBugReport } from '../utils/api';
import { getBrowserInfo } from '../utils/browserInfo';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string): AppError => {
    const appError = error instanceof Error 
      ? createError(error.message, 'USER_ERROR', 400, { originalError: error })
      : createError('An unknown error occurred', 'UNKNOWN_ERROR', 500, { originalError: error });
    
    logError(appError, context);
    return appError;
  }, []);

  const submitErrorReport = useCallback(async (
    error: AppError,
    userDescription?: string,
    severity: BugReportData['severity'] = 'medium'
  ): Promise<boolean> => {
    try {
      const bugReport: BugReportData = {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        description: userDescription,
        severity,
        category: 'functionality',
        errorStack: error.stack,
        browserInfo: getBrowserInfo(),
        sessionId: sessionStorage.getItem('sessionId') || undefined,
      };

      const response = await submitBugReport(bugReport);
      return response.success;
    } catch (submitError) {
      console.error('Failed to submit error report:', submitError);
      return false;
    }
  }, []);

  const createErrorWithContext = useCallback((
    message: string,
    context: string,
    details?: any
  ): AppError => {
    return createError(message, 'CONTEXT_ERROR', 400, { context, ...details });
  }, []);

  return {
    handleError,
    submitErrorReport,
    createErrorWithContext,
  };
};