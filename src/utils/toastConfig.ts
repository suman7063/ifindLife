
import { toast } from 'sonner';

export const showLogoutSuccessToast = () => {
  toast.success('Successfully logged out');
};

export const showLogoutErrorToast = () => {
  toast.error('Failed to log out. Please try again.');
};

export const showLoginSuccessToast = () => {
  toast.success('Successfully logged in');
};

export const showLoginErrorToast = (message?: string) => {
  toast.error(message || 'Failed to log in. Please try again.');
};
