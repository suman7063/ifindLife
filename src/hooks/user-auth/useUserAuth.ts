
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

  return {
    currentUser,
    loading,
    logout,
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert,
    rechargeWallet,
    hasTakenServiceFrom,
    getExpertShareLink,
  };
};
