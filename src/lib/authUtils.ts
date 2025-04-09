
import { toast } from 'sonner';

export const handleAuthError = (error: any, defaultMessage: string): void => {
  console.error(defaultMessage, error);
  
  let errorMessage = defaultMessage;
  
  if (error?.message) {
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
};
