
import { toast } from 'sonner';

export const handleAuthError = (error: any, defaultMessage: string = 'An error occurred') => {
  const errorMessage = error?.message || defaultMessage;
  console.error(errorMessage, error);
  toast.error(errorMessage);
};
