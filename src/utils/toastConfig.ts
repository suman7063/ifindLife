
import { toast } from 'sonner';

// Centralized toast configuration for 3-second duration
const TOAST_DURATION = 3000; // 3 seconds

export const showSuccessToast = (message: string) => {
  return toast.success(message, {
    duration: TOAST_DURATION,
  });
};

export const showErrorToast = (message: string) => {
  return toast.error(message, {
    duration: TOAST_DURATION,
  });
};

export const showInfoToast = (message: string) => {
  return toast.info(message, {
    duration: TOAST_DURATION,
  });
};

export const showWarningToast = (message: string) => {
  return toast.warning(message, {
    duration: TOAST_DURATION,
  });
};

// For login/logout specific messages
export const showLoginSuccessToast = () => {
  return showSuccessToast('Successfully logged in');
};

export const showLogoutSuccessToast = () => {
  return showSuccessToast('Successfully logged out');
};

export const showLoginErrorToast = (error?: string) => {
  return showErrorToast(error || 'Login failed. Please try again.');
};

export const showLogoutErrorToast = () => {
  return showErrorToast('Failed to log out. Please try again.');
};
