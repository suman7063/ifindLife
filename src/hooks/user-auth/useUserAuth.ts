
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { useUserDataFetcher } from './useUserDataFetcher';
import { useUserProfileManagement } from './useUserProfileManagement';
import { useUserFavorites } from './useUserFavorites';
import { useUserReviews } from './useUserReviews';
import { useUserReports } from './useUserReports';
import { useUserWallet } from './useUserWallet';
import { useExpertInteraction } from './useExpertInteraction';

export const useUserAuth = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Import functionality from separate hooks
  const { fetchUserData } = useUserDataFetcher(setCurrentUser, setLoading);
  const { updateProfileData } = useUserProfileManagement(currentUser, setCurrentUser);
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { addReport: reportExpert } = useUserReports(currentUser, setCurrentUser);
  const { rechargeWallet } = useUserWallet(currentUser, setCurrentUser);
  const { hasTakenServiceFrom, getExpertShareLink } = useExpertInteraction(currentUser);

  useEffect(() => {
    // Get session from localStorage
    const storedSession = localStorage.getItem('supabase.auth.token');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session?.currentSession?.user?.id) {
          fetchUserData(session.currentSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user?.id) {
          fetchUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      } else if (event === 'PASSWORD_RECOVERY') {
        // Handle password recovery flow
        console.log('Password recovery event received');
      } else if (event === 'USER_UPDATED') {
        // Refresh user data when user is updated
        if (session?.user?.id) {
          fetchUserData(session.user.id);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  // Password management
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(error.message || 'Failed to update password');
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || 'Failed to update password');
      return false;
    }
  };

  return {
    currentUser,
    loading,
    logout,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert,
    rechargeWallet,
    hasTakenServiceFrom,
    getExpertShareLink,
  };
};
