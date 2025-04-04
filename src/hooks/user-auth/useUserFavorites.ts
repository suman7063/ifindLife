
import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/auth/UserAuthContext';
import { Expert, UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
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
      const existingFavorite = favoriteExperts.find(e => {
        // First check if e is null or undefined
        if (e === null || e === undefined) {
          return false;
        }
        
        // Then check if it's an object
        if (typeof e === 'object') {
          // Check if id exists and is not null/undefined
          if ('id' in e && e.id !== undefined && e.id !== null) {
            // Use safe type conversion
            return String(e.id) === expertId;
          }
          return false;
        } else {
          // Handle primitive type case (likely string)
          // Make sure e is not null before using toString
          return e !== null ? String(e) === expertId : false;
        }
      });
      
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
      
      // Create a type-safe update to UserProfile
      const updatedUser: UserProfile = {
        ...currentUser,
        favorite_experts: updatedFavorites
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
      const updatedFavorites = (currentUser.favorite_experts || []).filter(expert => {
        // First check if expert is null or undefined
        if (expert === null || expert === undefined) {
          return false;
        }
        
        // Then check if it's an object
        if (typeof expert === 'object') {
          // Check if id exists and is not null/undefined
          if ('id' in expert && expert.id !== undefined && expert.id !== null) {
            // Use safe type conversion
            return String(expert.id) !== expertId;
          }
          return true; // Keep items without id
        } else {
          // Handle primitive type case
          // Make sure expert is not null before using toString
          return expert !== null ? String(expert) !== expertId : false;
        }
      });
      
      const updatedUser: UserProfile = {
        ...currentUser,
        favorite_experts: updatedFavorites
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
