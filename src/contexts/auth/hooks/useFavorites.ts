
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useFavorites = (user: any) => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Add expert to favorites
  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: user.id, expert_id: expertId }]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This expert is already in your favorites');
        } else {
          console.error('Error adding favorite:', error);
          toast.error('Failed to add to favorites');
        }
        return false;
      }
      
      // Update count
      await refreshFavoritesCount();
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('An error occurred while adding to favorites');
      return false;
    }
  };
  
  // Remove expert from favorites
  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to manage favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: user.id, expert_id: expertId });
      
      if (error) {
        console.error('Error removing favorite:', error);
        toast.error('Failed to remove from favorites');
        return false;
      }
      
      // Update count
      await refreshFavoritesCount();
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('An error occurred while removing from favorites');
      return false;
    }
  };
  
  // Check if expert is in favorites
  const checkIsFavorite = async (expertId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId })
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };
  
  // Refresh favorites count
  const refreshFavoritesCount = async (): Promise<void> => {
    if (!user) {
      setFavoritesCount(0);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error getting favorites count:', error);
        return;
      }
      
      setFavoritesCount(data.length);
    } catch (error) {
      console.error('Error getting favorites count:', error);
    }
  };

  return {
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    refreshFavoritesCount
  };
};
