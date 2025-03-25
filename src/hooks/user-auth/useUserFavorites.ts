
import { toast } from 'sonner';
import { UserProfile, Expert } from '@/types/supabase';
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
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: currentUser.id, expert_id: expertId }]);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...currentUser.favoriteExperts, { id: expertId } as any],
      };
      setCurrentUser(updatedUser);

      toast.success('Added to favorites!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to remove from favorites');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        favoriteExperts: currentUser.favoriteExperts.filter((expert) => expert.id !== expertId),
      };
      setCurrentUser(updatedUser);

      toast.success('Removed from favorites!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
    }
  };

  return {
    addToFavorites,
    removeFromFavorites
  };
};
