import { AppError } from '../types';

export class CustomError extends Error implements AppError {
  code?: string;
  statusCode?: number;
  details?: any;

  constructor(message: string, code?: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export const createError = (
  message: string,
  code?: string,
  statusCode?: number,
  details?: any
): CustomError => {
  return new CustomError(message, code, statusCode, details);
};

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof CustomError) {
    return error;
  }
  
  if (error instanceof Error) {
    return createError(error.message, 'UNKNOWN_ERROR', 500, { originalError: error });
  }
  
  return createError('An unknown error occurred', 'UNKNOWN_ERROR', 500, { originalError: error });
};

export const logError = (error: AppError, context?: string): void => {
  console.error(`Error${context ? ` in ${context}` : ''}:`, {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    details: error.details,
    stack: error.stack,
  });
};