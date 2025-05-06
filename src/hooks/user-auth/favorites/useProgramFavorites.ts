
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { FavoriteProgram } from '../types/favorites';

export const useProgramFavorites = (
  userId?: string,
  favoritePrograms: FavoriteProgram[] = [],
  setFavoritePrograms?: (programs: FavoriteProgram[]) => void,
  fetchFavorites?: () => Promise<void>
) => {
  const addProgramToFavorites = async (programId: number): Promise<boolean> => {
    if (!userId) {
      toast.error('You need to log in to add favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .insert({
          user_id: userId,
          program_id: programId
        });
        
      if (error) throw error;
      
      if (fetchFavorites) {
        fetchFavorites(); // Refresh the list
      }
      toast.success('Program added to favorites');
      return true;
    } catch (err) {
      console.error('Error adding program to favorites:', err);
      toast.error('Failed to add program to favorites');
      return false;
    }
  };
  
  const removeProgramFromFavorites = async (programId: number): Promise<boolean> => {
    if (!userId) {
      toast.error('You need to log in to manage favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId);
        
      if (error) throw error;
      
      if (setFavoritePrograms) {
        setFavoritePrograms(favoritePrograms.filter(item => item.program_id !== programId));
      }
      toast.success('Program removed from favorites');
      return true;
    } catch (err) {
      console.error('Error removing program from favorites:', err);
      toast.error('Failed to remove program from favorites');
      return false;
    }
  };
  
  return {
    addProgramToFavorites,
    removeProgramFromFavorites
  };
};
