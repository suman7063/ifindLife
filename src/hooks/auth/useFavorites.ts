
import { supabase, tables } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { ExpertIdDB, convertExpertIdToNumber, convertExpertIdToString } from '@/types/supabase/expertId';

export const useFavorites = () => {
  const addToFavorites = async (currentUser: UserProfile | null, expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return null;
    }

    try {
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);
      
      const { data, error } = await tables.user_favorites()
        .insert({ 
          user_id: currentUser.id, 
          expert_id: expertIdNumber 
        });

      if (error) throw error;

      // Return updated user data to update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...(currentUser.favoriteExperts || []), { id: expertId }]
      };

      toast.success('Added to favorites!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
      return null;
    }
  };

  const removeFromFavorites = async (currentUser: UserProfile | null, expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to remove from favorites');
      return null;
    }

    try {
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);
      
      const { data, error } = await tables.user_favorites()
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertIdNumber);

      if (error) throw error;

      // Return updated user data to update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: (currentUser.favoriteExperts || []).filter((expert: any) => expert.id !== expertId)
      };

      toast.success('Removed from favorites!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
      return null;
    }
  };

  const isFavorite = (expertId: string, favorites: string[] = []) => {
    return favorites.includes(expertId);
  };

  return {
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
};
