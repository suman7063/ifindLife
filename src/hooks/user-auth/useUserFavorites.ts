
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/types/expert';
import { Program } from '@/types/programs';

export interface FavoriteProgram {
  id: string;
  program_id: number;
  user_id: string;
}

export interface FavoriteExpert {
  id: string;
  expert_id: string;
  user_id: string;
}

export const useUserFavorites = (userId?: string) => {
  const [favoritePrograms, setFavoritePrograms] = useState<FavoriteProgram[]>([]);
  const [favoriteExperts, setFavoriteExperts] = useState<FavoriteExpert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);
  
  const fetchFavorites = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch favorite programs
      const { data: programsData, error: programsError } = await supabase
        .from('user_favorite_programs')
        .select('*')
        .eq('user_id', userId);
        
      if (programsError) throw programsError;
      setFavoritePrograms(programsData);
      
      // Fetch favorite experts
      const { data: expertsData, error: expertsError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId);
        
      if (expertsError) throw expertsError;
      
      const formattedExpertsData = expertsData.map(item => ({
        ...item,
        expert_id: String(item.expert_id)
      }));
      
      setFavoriteExperts(formattedExpertsData as FavoriteExpert[]);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };
  
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
      
      fetchFavorites(); // Refresh the list
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
      
      setFavoritePrograms(prev => prev.filter(item => item.program_id !== programId));
      toast.success('Program removed from favorites');
      return true;
    } catch (err) {
      console.error('Error removing program from favorites:', err);
      toast.error('Failed to remove program from favorites');
      return false;
    }
  };
  
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
          expert_id: parseInt(String(expert.id), 10)
        });
        
      if (error) throw error;
      
      fetchFavorites(); // Refresh the list
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
      const expertIdInt = parseInt(String(expert.id), 10);
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('expert_id', expertIdInt);
        
      if (error) throw error;
      
      setFavoriteExperts(prev => prev.filter(item => {
        const itemExpertId = parseInt(String(item.expert_id), 10);
        return itemExpertId !== expertIdInt;
      }));
      
      toast.success(`Removed ${expert.name} from favorites`);
      return true;
    } catch (err) {
      console.error('Error removing expert from favorites:', err);
      toast.error('Failed to remove expert from favorites');
      return false;
    }
  };
  
  const toggleExpertFavorite = async (expert: Expert): Promise<boolean> => {
    const expertIdStr = String(expert.id);
    const isFavorite = favoriteExperts.some(fav => String(fav.expert_id) === expertIdStr);
    
    if (isFavorite) {
      return await removeExpertFromFavorites(expert);
    } else {
      return await addExpertToFavorites(expert);
    }
  };

  return {
    favoritePrograms,
    favoriteExperts,
    loading,
    error,
    addProgramToFavorites,
    removeProgramFromFavorites,
    toggleExpertFavorite,
    addExpertToFavorites,
    removeExpertFromFavorites
  };
};
