
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
  // Convert function parameter types to handle number type for expertId
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { addReport } = useUserReports(currentUser, setCurrentUser);
  const { hasTakenServiceFrom, getExpertShareLink } = useExpertInteraction(currentUser);

  // Create wrapper functions to handle number type
  const addToFavoritesWrapper = async (expertId: number) => {
    return addToFavorites(String(expertId));
  };

  const removeFromFavoritesWrapper = async (expertId: number) => {
    return removeFromFavorites(String(expertId));
  };

  const addReviewWrapper = async (expertId: number, rating: number, comment: string) => {
    return addReview(String(expertId), rating, comment);
  };

  const addReportWrapper = async (expertId: number, reason: string, details: string) => {
    return addReport(String(expertId), reason, details);
  };

  const hasTakenServiceFromWrapper = async (expertId: number) => {
    return hasTakenServiceFrom(expertId);
  };

  // Return the wrapped functions with the correct types
  return {
    addToFavorites: addToFavoritesWrapper,
    removeFromFavorites: removeFromFavoritesWrapper,
    addReview: addReviewWrapper,
    reportExpert: addReportWrapper,
    hasTakenServiceFrom: hasTakenServiceFromWrapper,
    getExpertShareLink
  };
};
