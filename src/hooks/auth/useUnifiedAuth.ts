
import { useState, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const useUnifiedAuth = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: supabaseLogout } = useSupabaseAuth();
  const navigate = useNavigate();

  const userLogout = useCallback(async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    setIsLoggingOut(true);
    try {
      console.log("Unified Auth: Starting user logout process...");
      
      const success = await supabaseLogout();
      
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
        return true;
      } else {
        toast.error('Failed to log out. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out. Please try again later.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, supabaseLogout, navigate]);

  const expertLogout = useCallback(async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    setIsLoggingOut(true);
    try {
      console.log("Unified Auth: Starting expert logout process...");
      
      // First check if there's an expert profile
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('*')
        .maybeSingle();
      
      const success = await supabaseLogout();
      
      if (success) {
        toast.success('Successfully logged out from expert account');
        navigate('/');
        return true;
      } else {
        toast.error('Failed to log out. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out. Please try again later.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, supabaseLogout, navigate]);

  const fullLogout = useCallback(async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    setIsLoggingOut(true);
    try {
      console.log("Unified Auth: Starting full logout process...");
      
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Error during full logout:', error);
        toast.error('Failed to log out completely. Please try again.');
        return false;
      }
      
      toast.success('Successfully logged out from all accounts');
      navigate('/');
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Failed to log out. Please try again later.');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, navigate]);

  return {
    userLogout,
    expertLogout,
    fullLogout,
    isLoggingOut,
    setIsLoggingOut
  };
};
