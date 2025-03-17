
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useFavorites = () => {
  const addToFavorites = async (currentUser: UserProfile | null, expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: currentUser.id, expert_id: expertId }]);

      if (error) throw error;

      // Return updated user data to update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...currentUser.favoriteExperts, { id: expertId } as any],
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
      const { data, error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId);

      if (error) throw error;

      // Return updated user data to update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: currentUser.favoriteExperts.filter((expert) => expert.id !== expertId),
      };

      toast.success('Removed from favorites!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
      return null;
    }
  };

  return {
    addToFavorites,
    removeFromFavorites
  };
};
