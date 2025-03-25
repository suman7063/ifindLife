
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { useUserFavorites } from '@/hooks/user-auth/useUserFavorites';
import { useUserReviews } from '@/hooks/user-auth/useUserReviews';
import { useUserReports } from '@/hooks/user-auth/useUserReports';

export const useExpertInteractions = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { reportExpert } = useUserReports(currentUser, setCurrentUser);

  const hasTakenServiceFrom = (expertId: string): boolean => {
    // In a real app, this would check if the user has purchased services from this expert
    return false; // Placeholder implementation
  };

  const getExpertShareLink = (expertId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };

  return {
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
