
import { toast } from 'sonner';

/**
 * Types of database errors that can occur
 */
export type DatabaseErrorType = 
  | 'recursion'  // RLS policy recursion errors
  | 'permission' // Permission errors
  | 'not_found'  // Record not found
  | 'constraint' // Constraint violations (unique, foreign key, etc)
  | 'connection' // Connection issues
  | 'timeout'    // Query timeout
  | 'unknown';   // Any other error

/**
 * Analyzes a Supabase error and returns its type
 */
export const getDatabaseErrorType = (error: any): DatabaseErrorType => {
  if (!error) return 'unknown';
  
  const message = error.message || error.toString();
  
  if (message.includes('recursion')) {
    return 'recursion';
  } else if (message.includes('permission denied') || message.includes('not authorized')) {
    return 'permission';
  } else if (message.includes('not found') || message.includes('no rows')) {
    return 'not_found';
  } else if (
    message.includes('violates') || 
    message.includes('constraint') || 
    message.includes('duplicate key')
  ) {
    return 'constraint';
  } else if (message.includes('connection') || message.includes('network')) {
    return 'connection';
  } else if (message.includes('timeout')) {
    return 'timeout';
  }
  
  return 'unknown';
};

/**
 * Gets a user-friendly message for a database error
 */
export const getFriendlyErrorMessage = (error: any): string => {
  const errorType = getDatabaseErrorType(error);
  
  switch (errorType) {
    case 'recursion':
      return 'A database configuration issue occurred. Please contact support.';
    case 'permission':
      return 'You do not have permission to perform this action.';
    case 'not_found':
      return 'The requested information could not be found.';
    case 'constraint':
      const message = error.message || '';
      if (message.includes('duplicate key')) {
        return 'This record already exists.';
      } else {
        return 'The data provided conflicts with existing records.';
      }
    case 'connection':
      return 'Unable to connect to the database. Please check your internet connection.';
    case 'timeout':
      return 'The operation timed out. Please try again.';
    default:
      return 'An unexpected database error occurred.';
  }
};

/**
 * Handles database errors with consistent behavior
 * Returns true if error was handled, false otherwise
 */
export const handleDatabaseError = (error: any, customMessage?: string): boolean => {
  if (!error) return false;
  
  console.error('Database error:', error);
  
  const errorType = getDatabaseErrorType(error);
  const defaultMessage = getFriendlyErrorMessage(error);
  const displayMessage = customMessage || defaultMessage;
  
  // Display toast notification
  toast.error(displayMessage);
  
  // For serious errors, log extra details
  if (errorType === 'recursion' || errorType === 'permission') {
    console.warn('Serious database error detected:', error.message);
    // In a real app, you might want to report this to an error tracking service
  }
  
  return true;
};

/**
 * Retry a database operation with exponential backoff
 * Modified to properly handle Promise typing
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 300
): Promise<T> => {
  let retries = 0;
  let lastError: any;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      retries++;
      
      const errorType = getDatabaseErrorType(error);
      
      // Don't retry permission errors, they won't resolve on their own
      if (errorType === 'permission' || errorType === 'recursion') {
        break;
      }
      
      // Exponential backoff delay
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Retrying operation (${retries}/${maxRetries}) after ${delay}ms delay`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
