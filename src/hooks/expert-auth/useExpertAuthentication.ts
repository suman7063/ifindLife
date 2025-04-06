import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertRegistrationData } from './types';
import { toast } from 'sonner';
import { useExpertLogin } from './auth/useExpertLogin';

export const useExpertAuthentication = (
  setExpert: (expert: ExpertProfile | null) => void,
  setLoading: (loading: boolean) => void,
  fetchExpertProfile: (userId: string) => Promise<ExpertProfile | null>
) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { login } = useExpertLogin(setExpert, setLoading, fetchExpertProfile);
  
  const hasUserAccount = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking user account:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in hasUserAccount:', error);
      return false;
    }
  };
  
  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      localStorage.removeItem('expertProfile');
      
      setExpert(null);
      setIsUserLoggedIn(false);
      toast.success('Logged out successfully');
      
      setTimeout(() => {
        window.location.href = '/expert-login';
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (data: ExpertRegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        return false;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            specialization: data.specialization,
            experience: data.experience,
            bio: data.bio,
            certificate_urls: data.certificate_urls || [],
            selected_services: data.selected_services
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.session) {
        toast.error('Registration failed. No session created.');
        return false;
      }
      
      const selectedServices = Array.isArray(data.selected_services) 
        ? data.selected_services.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : [];

      const expertExperience = typeof data.experience === 'number' 
        ? String(data.experience) 
        : (data.experience || '');

      const expertData = {
        auth_id: authData.session.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        specialization: data.specialization || '',
        experience: expertExperience,
        bio: data.bio || '',
        certificate_urls: data.certificate_urls || [],
        selected_services: selectedServices,
        status: 'pending'
      };
      
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        toast.error(profileError.message);
        
        await supabase.auth.signOut();
        return false;
      }
      
      await supabase.auth.signOut();
      
      window.location.href = '/expert-login?status=registered';
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    login,
    logout,
    register,
    isUserLoggedIn,
    hasUserAccount
  };
};
