
import React, { useContext, useState, createContext, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

// Implement the provider logic here
export const FavoritesContext = createContext<any>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, userProfile, updateUserProfile } = useAuth();

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

  const isFavorite = (expertId: number) => {
    return favorites.includes(expertId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      addFavorite,
      removeFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
