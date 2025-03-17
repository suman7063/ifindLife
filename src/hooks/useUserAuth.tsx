
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { useUserProfile } from './auth/useUserProfile';
import { useFavorites } from './auth/useFavorites';
import { useReviews } from './auth/useReviews';
import { useReports } from './auth/useReports';
import { useWallet } from './auth/useWallet';
import { useShareLinks } from './auth/useShareLinks';

export const useUserAuth = () => {
  const { currentUser, loading, fetchUserData, updateCurrentUser, setLoadingState } = useUserProfile();
  const { addToFavorites, removeFromFavorites } = useFavorites();
  const { hasTakenServiceFrom, hasReviewedExpert, addReview } = useReviews();
  const { addReport } = useReports();
  const { rechargeWallet } = useWallet();
  const { getExpertShareLink, getReferralLink } = useShareLinks();

  // Initialize auth state
  useEffect(() => {
    // Get session from localStorage
    const storedSession = localStorage.getItem('supabase.auth.token');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session?.currentSession?.user?.id) {
          loadUserData(session.currentSession.user.id);
        } else {
          setLoadingState(false);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
        setLoadingState(false);
      }
    } else {
      setLoadingState(false);
    }

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user?.id) {
          loadUserData(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        updateCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    setLoadingState(true);
    const userProfile = await fetchUserData(userId);
    updateCurrentUser(userProfile);
    setLoadingState(false);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      updateCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  // Wrapper functions to manage state updates
  const handleAddToFavorites = async (expertId: string) => {
    const updatedUser = await addToFavorites(currentUser, expertId);
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
  };

  const handleRemoveFromFavorites = async (expertId: string) => {
    const updatedUser = await removeFromFavorites(currentUser, expertId);
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
  };

  const handleAddReview = async (expertId: string, rating: number, comment: string) => {
    const updatedUser = await addReview(currentUser, expertId, rating, comment);
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
  };

  const handleAddReport = async (expertId: string, reason: string, details: string) => {
    const updatedUser = await addReport(currentUser, expertId, reason, details);
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
  };

  const handleRechargeWallet = async (amount: number) => {
    const updatedUser = await rechargeWallet(currentUser, amount);
    if (updatedUser) {
      updateCurrentUser(updatedUser);
    }
  };

  const handleHasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    return await hasTakenServiceFrom(currentUser, expertId);
  };

  const handleHasReviewedExpert = async (expertId: string): Promise<boolean> => {
    return await hasReviewedExpert(currentUser, expertId);
  };

  const handleGetExpertShareLink = (expertId: string): string => {
    return getExpertShareLink(expertId, currentUser?.id);
  };

  return {
    currentUser,
    loading,
    logout,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
    addReview: handleAddReview,
    addReport: handleAddReport,
    rechargeWallet: handleRechargeWallet,
    hasTakenServiceFrom: handleHasTakenServiceFrom,
    hasReviewedExpert: handleHasReviewedExpert,
    getExpertShareLink: handleGetExpertShareLink,
  };
};
