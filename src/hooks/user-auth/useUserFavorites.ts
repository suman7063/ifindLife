
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Expert } from '@/types/expert';

export interface FavoriteProgram {
  id: string;
  program_id: number;
  user_id: string;
}

export interface FavoriteExpert {
  id: string;
  expert_id: string; // Changed to string to match the type expected
  user_id: string;
}

export const useUserFavorites = (userId?: string) => {
  const [favoritePrograms, setFavoritePrograms] = useState<FavoriteProgram[]>([]);
  const [favoriteExperts, setFavoriteExperts] = useState<FavoriteExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only load favorites if we have a user ID
    if (userId) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // Load favorite programs
      const { data: programData, error: programError } = await supabase
        .from('user_favorite_programs')
        .select('*')
        .eq('user_id', userId);
        
      if (programError) throw programError;
      
      setFavoritePrograms(programData || []);
      
      // Load favorite experts
      const { data: expertData, error: expertError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId);
        
      if (expertError) throw expertError;
      
      // Convert expert_id to string to match FavoriteExpert type
      const convertedExpertData = expertData?.map(item => ({
        ...item,
        expert_id: String(item.expert_id)
      })) || [];
      
      setFavoriteExperts(convertedExpertData as FavoriteExpert[]);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err instanceof Error ? err : new Error('Failed to load favorites'));
    } finally {
      setLoading(false);
    }
  };
  
  const addProgramToFavorites = async (programId: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .insert({ 
          user_id: userId, 
          program_id: programId 
        });
        
      if (error) throw error;
      
      // Reload favorites
      await loadFavorites();
      return true;
    } catch (err) {
      console.error('Error adding program to favorites:', err);
      return false;
    }
  };
  
  const removeProgramFromFavorites = async (programId: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .match({ 
          user_id: userId, 
          program_id: programId 
        });
        
      if (error) throw error;
      
      // Update local state
      setFavoritePrograms(prev => prev.filter(fp => fp.program_id !== programId));
      return true;
    } catch (err) {
      console.error('Error removing program from favorites:', err);
      return false;
    }
  };

  const toggleExpertFavorite = async (expert: Expert): Promise<boolean> => {
    if (!userId || !expert?.id) return false;
    
    try {
      const expertId = String(expert.id);
      const isFavorite = favoriteExperts.some(fe => String(fe.expert_id) === expertId);
      
      if (isFavorite) {
        return await removeExpertFromFavorites(expert);
      } else {
        return await addExpertToFavorites(expert);
      }
    } catch (err) {
      console.error('Error toggling expert favorite:', err);
      return false;
    }
  };

  const addExpertToFavorites = async (expert: Expert): Promise<boolean> => {
    if (!userId || !expert?.id) return false;
    
    try {
      const expertId = String(expert.id);
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({ 
          user_id: userId, 
          expert_id: parseInt(expertId, 10) // Convert to number for the database
        });
        
      if (error) throw error;
      
      // Reload favorites
      await loadFavorites();
      return true;
    } catch (err) {
      console.error('Error adding expert to favorites:', err);
      return false;
    }
  };
  
  const removeExpertFromFavorites = async (expert: Expert): Promise<boolean> => {
    if (!userId || !expert?.id) return false;
    
    try {
      const expertId = String(expert.id);
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('expert_id', parseInt(expertId, 10)); // Convert to number for the database
        
      if (error) throw error;
      
      // Update local state
      setFavoriteExperts(prev => prev.filter(fe => fe.expert_id !== expertId));
      return true;
    } catch (err) {
      console.error('Error removing expert from favorites:', err);
      return false;
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
    removeExpertFromFavorites,
    refresh: loadFavorites,
    isProgramFavorite: (programId: number) => favoritePrograms.some(fp => fp.program_id === programId),
    isExpertFavorite: (expertId: number | string) => favoriteExperts.some(fe => String(fe.expert_id) === String(expertId))
  };
};
