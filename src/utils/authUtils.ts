
import { toast } from 'sonner';

export const handleAuthError = (error: any, defaultMessage: string = 'An error occurred') => {
  console.error('Auth error:', error);
  
  // Check if the error is a Supabase error with a message
  if (error && error.message) {
    toast.error(error.message);
  } else if (error && error.toString) {
    // Try to convert the error to a string
    toast.error(error.toString());
  } else {
    // Use the default message as fallback
    toast.error(defaultMessage);
  }
};
