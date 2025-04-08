// Find and fix the issue with passing a string | number to a function expecting string
import { supabase } from '@/lib/supabase';

import { useState, useEffect, useCallback } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ExpertProfile } from '@/types/supabase/expert';

export const useExpertInteractions = () => {
  const { currentUser, logout } = useUserAuth();
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpertProfile = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error fetching expert profile:', error);
        setError(error.message);
      } else {
        setExpertProfile(data);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching expert profile:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchExpertProfile(currentUser.id);
    }
  }, [currentUser, fetchExpertProfile]);

  // Fix the issue with setting expert profile from unknown data
  const updateExpertProfile = async (updates: Partial<ExpertProfile>) => {
    setLoading(true);
    setError(null);
    try {
      if (!expertProfile?.id) {
        throw new Error('Expert profile ID is missing.');
      }

      const { data, error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', expertProfile.id)
        .single();

      if (error) {
        console.error('Error updating expert profile:', error);
        setError(error.message);
        return false;
      } else {
        // Type cast the data to ensure it's an ExpertProfile before setting state
        setExpertProfile(data as ExpertProfile);
        return true;
      }
    } catch (err: any) {
      console.error('Unexpected error updating expert profile:', err);
      setError(err.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOutExpert = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await logout();

      if (error) {
        console.error('Error signing out expert:', error);
        setError(error.message);
      } else {
        setExpertProfile(null);
      }
    } catch (err: any) {
      console.error('Unexpected error signing out expert:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // If there's a function that incorrectly handles expert IDs, fix it:
  const someFunction = async (expertId: string | number) => {
    // Ensure expertId is string when passing to functions that expect string
    const expertIdString = String(expertId);
    
    // Use the string version in database calls
    const { data } = await supabase
      .from('experts')
      .select('*')
      .eq('id', expertIdString)
      .single();
      
    // ...rest of the function
  };

  return {
    expertProfile,
    loading,
    error,
    fetchExpertProfile,
    updateExpertProfile,
    signOutExpert,
  };
};
