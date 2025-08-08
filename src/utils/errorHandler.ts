/**
 * Centralized error handling with security considerations
 */

import { secureLogger } from './secureLogger';
import { toast } from 'sonner';

interface ErrorDetails {
  code?: string;
  message: string;
  userMessage?: string;
  context?: Record<string, any>;
}

export class SecureError extends Error {
  public readonly code?: string;
  public readonly userMessage: string;
  public readonly context?: Record<string, any>;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = 'SecureError';
    this.code = details.code;
    this.userMessage = details.userMessage || 'An unexpected error occurred';
    this.context = details.context;
  }
}

export const errorHandler = {
  /**
   * Handle authentication errors securely
   */
  handleAuthError: (error: any, userAction?: string) => {
    const context = userAction ? { action: userAction } : undefined;
    
    if (error?.message?.includes('Invalid login credentials')) {
      secureLogger.warn('Authentication failed', context);
      toast.error('Invalid credentials. Please check your email and password.');
      return;
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      secureLogger.info('Email confirmation required', context);
      toast.error('Please check your email and click the confirmation link.');
      return;
    }
    
    if (error?.message?.includes('Too many requests')) {
      secureLogger.warn('Rate limit exceeded', context);
      toast.error('Too many attempts. Please wait before trying again.');
      return;
    }
    
    // Generic auth error
    secureLogger.error('Authentication error', { error: error?.message, ...context });
    toast.error('Authentication failed. Please try again.');
  },

  /**
   * Handle API errors securely
   */
  handleApiError: (error: any, operation?: string) => {
    const context = operation ? { operation } : undefined;
    
    if (error?.status === 403) {
      secureLogger.warn('Access denied', context);
      toast.error('You do not have permission to perform this action.');
      return;
    }
    
    if (error?.status === 404) {
      secureLogger.info('Resource not found', context);
      toast.error('The requested resource was not found.');
      return;
    }
    
    if (error?.status >= 500) {
      secureLogger.error('Server error', { status: error.status, ...context });
      toast.error('Server error. Please try again later.');
      return;
    }
    
    // Generic API error
    secureLogger.error('API error', { error: error?.message, status: error?.status, ...context });
    toast.error('An error occurred. Please try again.');
  },

  /**
   * Handle validation errors
   */
  handleValidationError: (error: any, field?: string) => {
    const context = field ? { field } : undefined;
    secureLogger.info('Validation error', { message: error?.message, ...context });
    
    if (field) {
      toast.error(`Invalid ${field}. Please check your input.`);
    } else {
      toast.error('Please check your input and try again.');
    }
  },

  /**
   * Handle network errors
   */
  handleNetworkError: (error: any, operation?: string) => {
    const context = operation ? { operation } : undefined;
    secureLogger.warn('Network error', { message: error?.message, ...context });
    toast.error('Network error. Please check your connection and try again.');
  },

  /**
   * Handle generic errors with secure logging
   */
  handleError: (error: any, userMessage?: string, context?: Record<string, any>) => {
    if (error instanceof SecureError) {
      secureLogger.error(error.message, { code: error.code, ...error.context });
      toast.error(error.userMessage);
      return;
    }
    
    secureLogger.error('Unexpected error', { 
      message: error?.message, 
      stack: error?.stack?.substring(0, 200), // Limit stack trace
      ...context 
    });
    
    toast.error(userMessage || 'An unexpected error occurred. Please try again.');
  }
};