
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useUserFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchFavorites();
    } else {
      setFavoriteExperts([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]); // Use user.id instead of user object
  
  const fetchFavorites = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const expertIds = data.map(item => item.expert_id);
      setFavoriteExperts(expertIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addFavorite = async (expertId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      
      setFavoriteExperts(prev => [...prev, expertId]);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };
  
  const removeFavorite = async (expertId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({
          user_id: user.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      
      setFavoriteExperts(prev => prev.filter(id => id !== expertId));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };
  
  const isFavorite = (expertId: string): boolean => {
    return favoriteExperts.includes(expertId);
  };
  
  return {
    favoriteExperts,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    refreshFavorites: fetchFavorites
  };
};
