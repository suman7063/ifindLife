
import { toast } from 'sonner';
import { UserProfile, Expert } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useUserFavorites = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return false;
    }

    try {
      const newFavorite = {
        user_id: currentUser.id,
        expert_id: expertId
      };

      const { error } = await supabase
        .from('user_favorites')
        .insert(newFavorite);

      if (error) throw error;

      // Fetch the expert details to add to favoriteExperts
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();

      if (expertError) throw expertError;

      const updatedUser = {
        ...currentUser,
        favoriteExperts: [...(currentUser.favoriteExperts || []), expertData],
      };
      
      setCurrentUser(updatedUser);
      toast.success('Added to favorites');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to manage favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId);

      if (error) throw error;

      const updatedUser = {
        ...currentUser,
        favoriteExperts: (currentUser.favoriteExperts || []).filter(expert => expert.id !== expertId),
      };
      
      setCurrentUser(updatedUser);
      toast.success('Removed from favorites');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
      return false;
    }
  };

  return {
    addToFavorites,
    removeFromFavorites
  };
};
