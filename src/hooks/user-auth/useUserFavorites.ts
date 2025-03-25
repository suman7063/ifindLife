
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useUserFavorites = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addToFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return;
    }

    try {
      const newFavorite = {
        user_id: currentUser.id,
        expert_id: parseInt(expertId, 10), // Convert string to number
      };

      const { error } = await supabase
        .from('user_favorites')
        .insert(newFavorite);

      if (error) throw error;

      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...(currentUser.favoriteExperts || []), { id: expertId }],
      };
      
      setCurrentUser(updatedUser);
      toast.success('Added to favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to manage favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', parseInt(expertId, 10)); // Convert string to number

      if (error) throw error;

      const updatedUser = {
        ...currentUser,
        favoriteExperts: (currentUser.favoriteExperts || []).filter(expert => expert.id !== expertId),
      };
      
      setCurrentUser(updatedUser);
      toast.success('Removed from favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
    }
  };

  return {
    addToFavorites,
    removeFromFavorites
  };
};
