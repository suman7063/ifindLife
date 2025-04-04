
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Expert, UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

export const useUserFavorites = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return false;
    }

    try {
      // Check if already in favorites
      const favoriteExperts = currentUser.favorite_experts || [];
      const existingFavorite = favoriteExperts.find(e => typeof e === 'object' ? e.id.toString() === expertId : e.toString() === expertId);
      
      if (existingFavorite) {
        toast.info('This expert is already in your favorites');
        return false;
      }

      // Add to favorites in the database
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: currentUser.id,
          expert_id: parseInt(expertId, 10) // Convert to number for database
        });

      if (error) throw error;

      // Get the expert details to add to the local state
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();

      if (expertError) throw expertError;

      // Update the local state
      const updatedFavorites = [...(currentUser.favorite_experts || []), expertData.id.toString()];
      const updatedUser = {
        ...currentUser,
        favorite_experts: updatedFavorites,
        favoriteExperts: updatedFavorites
      };
      setCurrentUser(updatedUser);

      toast.success('Added to favorites!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      // Remove from database
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', parseInt(expertId, 10)); // Convert to number for database

      if (error) throw error;

      // Update local state
      const updatedFavorites = (currentUser.favorite_experts || []).filter(
        expert => typeof expert === 'object' ? expert.id.toString() !== expertId : expert.toString() !== expertId
      );
      
      const updatedUser = {
        ...currentUser,
        favorite_experts: updatedFavorites,
        favoriteExperts: updatedFavorites
      };
      setCurrentUser(updatedUser);

      toast.success('Removed from favorites');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
      return false;
    }
  };

  return {
    addToFavorites,
    removeFromFavorites
  };
};
