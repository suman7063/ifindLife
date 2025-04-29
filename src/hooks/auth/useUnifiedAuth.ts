
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useUnifiedAuth = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  /**
   * Logs out a user account only
   */
  const userLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("User logout error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      console.error("User logout error:", error);
      toast.error(error.message || "An error occurred during logout");
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  /**
   * Logs out an expert account only
   */
  const expertLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Expert logout error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      console.error("Expert logout error:", error);
      toast.error(error.message || "An error occurred during logout");
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  /**
   * Logs out all accounts (both user and expert)
   */
  const fullLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error("Full logout error:", error);
        toast.error(error.message);
        return false;
      }
      
      localStorage.removeItem('expertProfile');
      localStorage.removeItem('userProfile');
      
      toast.success("Logged out of all accounts");
      return true;
    } catch (error: any) {
      console.error("Full logout error:", error);
      toast.error(error.message || "An error occurred during logout");
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return {
    userLogout,
    expertLogout,
    fullLogout,
    isLoggingOut,
    setIsLoggingOut
  };
};
