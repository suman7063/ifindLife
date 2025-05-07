
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { FavoritesContext } from './FavoritesContext';
import { FavoritesContextType } from './types';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, userProfile } = useAuth();

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setFavorites(data.map(item => item.expert_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (expertId: number) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      
      setFavorites(prev => [...prev, expertId]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeFavorite = async (expertId: number) => {
    try {
      if (!user) {
        toast.error('You must be logged in to remove favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('expert_id', expertId);
        
      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== expertId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isExpertFavorite = (expertId: number) => {
    return favorites.includes(expertId);
  };
  
  const toggleExpertFavorite = async (expertId: number) => {
    if (isExpertFavorite(expertId)) {
      return await removeFavorite(expertId);
    } else {
      return await addFavorite(expertId);
    }
  };
  
  // For program favorites (stub implementation for now)
  const programFavorites: number[] = [];
  const isProgramFavorite = (programId: number) => false;
  const toggleProgramFavorite = async (programId: number) => false;

  const contextValue: FavoritesContextType = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isExpertFavorite,
    toggleExpertFavorite,
    expertFavorites: favorites,
    programFavorites,
    isProgramFavorite,
    toggleProgramFavorite
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
