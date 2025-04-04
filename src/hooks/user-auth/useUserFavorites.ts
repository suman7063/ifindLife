
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
        if (e === null || e === undefined) return false;
        
        // Use type guards to ensure e is not null before accessing properties
        if (typeof e === 'object' && e !== null) {
          // Safe access using conditional check - only access id if it's not null or undefined
          if (e.id !== undefined && e.id !== null) {
            return e.id.toString() === expertId;
          }
          return false;
        } else {
          // Handle primitive type case (likely string)
          if (e !== null && e !== undefined) {
            return e.toString() === expertId;
          }
          return false;
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
        if (expert === null || expert === undefined) return false;
        
        // Use type guards to ensure expert is not null before accessing properties
        if (typeof expert === 'object' && expert !== null) {
          // Safe access with null check for the id property - only access id if it's not null or undefined
          if (expert.id !== undefined && expert.id !== null) {
            return expert.id.toString() !== expertId;
          }
          return true; // Keep items without id
        } else {
          // Handle primitive type case
          if (expert !== null && expert !== undefined) {
            return expert.toString() !== expertId;
          }
          return true; // Keep nullish items
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
