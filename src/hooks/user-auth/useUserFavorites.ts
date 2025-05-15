
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export const useUserFavorites = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Convert string IDs to numbers if needed
  const userFavorites = userProfile?.favorite_experts?.map(id => 
    typeof id === 'string' ? parseInt(id, 10) : id
  ).filter(id => !isNaN(Number(id))) || [];
  
  // Add expert to favorites
  const addToFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    if (!isAuthenticated || !userProfile) {
      toast.error('You must be logged in to add favorites');
      return false;
    }
    
    setLoading(true);
    try {
      // Add to user_favorites table
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userProfile.id,
          expert_id: expertId
        });
      
      if (error) {
        console.error('Error adding to favorites:', error);
        toast.error('Failed to add to favorites');
        return false;
      }
      
      // Update local state
      setFavorites(prev => [...prev, expertId]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userProfile]);
  
  // Remove expert from favorites
  const removeFromFavorites = useCallback(async (expertId: number): Promise<boolean> => {
    if (!isAuthenticated || !userProfile) {
      toast.error('You must be logged in to manage favorites');
      return false;
    }
    
    setLoading(true);
    try {
      // Remove from user_favorites table
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertId);
      
      if (error) {
        console.error('Error removing from favorites:', error);
        toast.error('Failed to remove from favorites');
        return false;
      }
      
      // Update local state
      setFavorites(prev => prev.filter(id => id !== expertId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userProfile]);
  
  return {
    favorites: userFavorites,
    addToFavorites,
    removeFromFavorites,
    loading,
    isInFavorites: (expertId: number) => userFavorites.includes(expertId)
  };
};
