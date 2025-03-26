
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
      // Check if already in favorites
      const existingFavorite = currentUser.favoriteExperts?.find(e => e.id.toString() === expertId);
      if (existingFavorite) {
        toast.info('This expert is already in your favorites');
        return false;
      }

      // Add to favorites in the database
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: currentUser.id,
          expert_id: parseInt(expertId, 10) // Convert to number for database
        });

      if (error) throw error;

      // Get the expert details to add to the local state
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();

      if (expertError) throw expertError;

      // Update the local state
      const updatedFavorites = [...(currentUser.favoriteExperts || []), expertData as Expert];
      const updatedUser = {
        ...currentUser,
        favoriteExperts: updatedFavorites
      };
      setCurrentUser(updatedUser);

      toast.success('Added to favorites!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      // Remove from database
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', parseInt(expertId, 10)); // Convert to number for database

      if (error) throw error;

      // Update local state
      const updatedFavorites = currentUser.favoriteExperts?.filter(
        expert => expert.id.toString() !== expertId
      ) || [];
      
      const updatedUser = {
        ...currentUser,
        favoriteExperts: updatedFavorites
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
