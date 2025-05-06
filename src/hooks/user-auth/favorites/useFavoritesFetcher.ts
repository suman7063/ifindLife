
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FavoriteProgram, FavoriteExpert } from '../types/favorites';

export const useFavoritesFetcher = (userId?: string) => {
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
  
  return {
    favoritePrograms,
    favoriteExperts,
    setFavoritePrograms,
    setFavoriteExperts,
    loading,
    error,
    fetchFavorites
  };
};
