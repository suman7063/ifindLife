
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Expert } from '@/types/expert';
import { FavoriteExpert } from '../types/favorites';

export const useExpertFavorites = (
  userId?: string,
  favoriteExperts: FavoriteExpert[] = [],
  setFavoriteExperts?: (experts: FavoriteExpert[]) => void,
  fetchFavorites?: () => Promise<void>
) => {
  const addExpertToFavorites = async (expert: Expert): Promise<boolean> => {
    if (!userId) {
      toast.error('You need to log in to add favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          expert_id: String(expert.auth_id)
        });
        
      if (error) throw error;
      
      if (fetchFavorites) {
        fetchFavorites(); // Refresh the list
      }
      toast.success(`Added ${expert.name} to favorites`);
      return true;
    } catch (err) {
      console.error('Error adding expert to favorites:', err);
      toast.error('Failed to add expert to favorites');
      return false;
    }
  };
  
  const removeExpertFromFavorites = async (expert: Expert): Promise<boolean> => {
    if (!userId) {
      toast.error('You need to log in to manage favorites');
      return false;
    }
    
    try {
      const expertIdStr = String(expert.auth_id);
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('expert_id', expertIdStr);
        
      if (error) throw error;
      
      if (setFavoriteExperts) {
        // Fix the type issue here - explicitly cast to the expected type
        setFavoriteExperts(favoriteExperts.filter(item => {
          const itemExpertId = String(item.expert_id);
          return itemExpertId !== expertIdStr;
        }));
      }
      
      toast.success(`Removed ${expert.name} from favorites`);
      return true;
    } catch (err) {
      console.error('Error removing expert from favorites:', err);
      toast.error('Failed to remove expert from favorites');
      return false;
    }
  };
  
  const toggleExpertFavorite = async (expert: Expert): Promise<boolean> => {
    const expertIdStr = String(expert.auth_id);
    const isFavorite = favoriteExperts.some(fav => String(fav.expert_id) === expertIdStr);
    
    if (isFavorite) {
      return await removeExpertFromFavorites(expert);
    } else {
      return await addExpertToFavorites(expert);
    }
  };

  return {
    addExpertToFavorites,
    removeExpertFromFavorites,
    toggleExpertFavorite
  };
};
