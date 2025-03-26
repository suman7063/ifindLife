
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
  const { addReport } = useUserReports(currentUser, setCurrentUser);

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    // In a real app, this would check if the user has purchased services from this expert
    return true; // Placeholder implementation
  };

  const getExpertShareLink = (expertId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };

  return {
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert: addReport, // Alias addReport as reportExpert for consistency in the API
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
