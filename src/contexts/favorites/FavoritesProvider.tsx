
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { FavoritesContext } from './FavoritesContext';
import { FavoritesContextType } from './types';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expertFavorites, setExpertFavorites] = useState<number[]>([]);
  const [programFavorites, setProgramFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, userProfile } = useAuth();

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setExpertFavorites([]);
      setProgramFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      // Load expert favorites
      const { data: expertData, error: expertError } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', user.id);
        
      if (expertError) throw expertError;
      
      setExpertFavorites(expertData.map(item => item.expert_id));
      
      // Load program favorites
      const { data: programData, error: programError } = await supabase
        .from('user_favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
        
      if (programError) throw programError;
      
      setProgramFavorites(programData.map(item => item.program_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addExpertFavorite = async (expertId: number) => {
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
      
      setExpertFavorites(prev => [...prev, expertId]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeExpertFavorite = async (expertId: number) => {
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
      
      setExpertFavorites(prev => prev.filter(id => id !== expertId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isExpertFavorite = (expertId: number) => {
    return expertFavorites.includes(expertId);
  };
  
  const toggleExpertFavorite = async (expertId: number) => {
    if (isExpertFavorite(expertId)) {
      return await removeExpertFavorite(expertId);
    } else {
      return await addExpertFavorite(expertId);
    }
  };
  
  // Program favorites implementation
  const addProgramFavorite = async (programId: number) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorite_programs')
        .insert({
          user_id: user.id,
          program_id: programId
        });
        
      if (error) throw error;
      
      setProgramFavorites(prev => [...prev, programId]);
      toast.success('Program added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding program favorite:', error);
      toast.error('Failed to add program to favorites');
      return false;
    }
  };

  const removeProgramFavorite = async (programId: number) => {
    try {
      if (!user) {
        toast.error('You must be logged in to remove favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programId);
        
      if (error) throw error;
      
      setProgramFavorites(prev => prev.filter(id => id !== programId));
      toast.success('Program removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing program favorite:', error);
      toast.error('Failed to remove program from favorites');
      return false;
    }
  };

  const isProgramFavorite = (programId: number) => {
    return programFavorites.includes(programId);
  };

  const toggleProgramFavorite = async (programId: number) => {
    if (isProgramFavorite(programId)) {
      return await removeProgramFavorite(programId);
    } else {
      return await addProgramFavorite(programId);
    }
  };

  const contextValue: FavoritesContextType = {
    favorites: expertFavorites, // Keep for backward compatibility
    loading,
    addFavorite: addExpertFavorite, // Keep for backward compatibility
    removeFavorite: removeExpertFavorite, // Keep for backward compatibility
    isExpertFavorite,
    toggleExpertFavorite,
    expertFavorites,
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
