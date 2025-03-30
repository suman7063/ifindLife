
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { useUserFavorites } from '@/hooks/user-auth/useUserFavorites';
import { useUserReviews } from '@/hooks/user-auth/useUserReviews';
import { useUserReports } from '@/hooks/user-auth/useUserReports';
import { useExpertInteraction } from '@/hooks/user-auth/useExpertInteraction';

export const useExpertInteractions = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  // Get the original functions
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { addReport } = useUserReports(currentUser, setCurrentUser);
  const { hasTakenServiceFrom, getExpertShareLink } = useExpertInteraction(currentUser);

  // Create string-compatible versions of these functions
  const addToFavoritesWrapper = async (expertId: string) => {
    return addToFavorites(expertId);
  };

  const removeFromFavoritesWrapper = async (expertId: string) => {
    return removeFromFavorites(expertId);
  };

  const addReviewWrapper = async (expertId: string, rating: number, comment: string) => {
    return addReview(expertId, rating, comment);
  };

  const reportExpertWrapper = async (expertId: string, reason: string, details: string) => {
    return addReport(expertId, reason, details);
  };

  const hasTakenServiceFromWrapper = (expertId: string) => {
    // Convert to number if the hook expects a number, or handle string directly
    return hasTakenServiceFrom(expertId);
  };

  const getExpertShareLinkWrapper = (expertId: string) => {
    return getExpertShareLink(expertId);
  };

  // Return the wrapped functions
  return {
    addToFavorites: addToFavoritesWrapper,
    removeFromFavorites: removeFromFavoritesWrapper,
    addReview: addReviewWrapper,
    reportExpert: reportExpertWrapper,
    hasTakenServiceFrom: hasTakenServiceFromWrapper,
    getExpertShareLink: getExpertShareLinkWrapper
  };
};
