
// Add this file if it doesn't exist or update it
import { useState } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { toast } from 'sonner';
import { ExpertRegistrationData } from '../types';

export const useExpertRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useExpertAuth();
  
  // Ensure register exists, even as a fallback
  const register = auth.register || (async () => {
    toast.error('Expert registration is not currently available');
    return false;
  });

  const registerExpert = async (data: ExpertRegistrationData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await register(data.email, data.password, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        bio: data.bio,
        certificate_urls: data.certificate_urls,
        selected_services: data.selected_services
      });
      
      if (success) {
        toast.success('Registration successful! Please log in.');
        return true;
      } else {
        setError('Registration failed');
        toast.error('Registration failed. Please try again.');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Registration error: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    registerExpert,
    isLoading,
    error
  };
};

export default useExpertRegistration;
