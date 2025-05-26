
import { toast } from 'sonner';
import { RegisterFormData } from './types';

export const validateRegistrationForm = (formData: RegisterFormData): boolean => {
  const { name, email, phone, password, confirmPassword, country } = formData;
  
  // Basic validation
  if (!name || !email || !phone || !password || !country) {
    toast.error('Please fill all required fields');
    return false;
  }
  
  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return false;
  }
  
  if (password.length < 6) {
    toast.error('Password must be at least 6 characters long');
    return false;
  }
  
  return true;
};
