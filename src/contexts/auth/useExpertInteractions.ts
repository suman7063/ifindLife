
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
  // Update these hooks to handle number type for expertId
  const { addToFavorites, removeFromFavorites } = useUserFavorites(currentUser, setCurrentUser);
  const { addReview } = useUserReviews(currentUser, setCurrentUser);
  const { addReport } = useUserReports(currentUser, setCurrentUser);
  const { hasTakenServiceFrom, getExpertShareLink } = useExpertInteraction(currentUser);

  // When returning, explicitly define addReport as reportExpert for the UserAuthContext
  return {
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert: addReport, // Aliasing addReport as reportExpert 
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
