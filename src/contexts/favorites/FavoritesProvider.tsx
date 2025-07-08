
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { FavoritesContext } from './FavoritesContext';
import { FavoritesContextType } from './types';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Favorite IDs - expert IDs are now UUIDs
  const [expertFavorites, setExpertFavorites] = useState<string[]>([]);
  const [programFavorites, setProgramFavorites] = useState<number[]>([]);
  
  // Favorite details with full data
  const [expertFavoriteDetails, setExpertFavoriteDetails] = useState<Array<{ id: string, name: string }>>([]);
  const [programFavoriteDetails, setProgramFavoriteDetails] = useState<Array<{ id: number, title: string }>>([]);
  
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSimpleAuth();

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setExpertFavorites([]);
      setProgramFavorites([]);
      setExpertFavoriteDetails([]);
      setProgramFavoriteDetails([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      // Load expert favorites with details
      const { data: expertData, error: expertError } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', user.id);
        
      if (expertError) throw expertError;
      
      const expertIds = expertData.map(item => item.expert_id);
      setExpertFavorites(expertIds);
      
      // Fetch expert details for these IDs
      if (expertIds.length > 0) {
        const { data: expertsDetails, error: expertsDetailsError } = await supabase
          .from('experts')
          .select('id, name')
          .in('id', expertIds);
          
        if (expertsDetailsError) throw expertsDetailsError;
        
        // IDs are already strings (UUIDs)
        setExpertFavoriteDetails(expertsDetails.map(expert => ({
          id: expert.id,
          name: expert.name
        })));
      }
      
      // Load program favorites with details
      const { data: programData, error: programError } = await supabase
        .from('user_favorite_programs')
        .select('program_id')
        .eq('user_id', user.id);
        
      if (programError) throw programError;
      
      const programIds = programData.map(item => item.program_id);
      setProgramFavorites(programIds);
      
      // Fetch program details for these IDs
      if (programIds.length > 0) {
        const { data: programsDetails, error: programsDetailsError } = await supabase
          .from('programs')
          .select('id, title')
          .in('id', programIds);
          
        if (programsDetailsError) throw programsDetailsError;
        
        setProgramFavoriteDetails(programsDetails);
      }
    } catch (error) {
      console.error('Error loading favorites with details:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addExpertFavorite = async (expertId: string) => {
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
      
      // Fetch the expert details to update the details array
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('id, name')
        .eq('id', expertId)
        .single();
        
      if (!expertError && expertData) {
        setExpertFavoriteDetails(prev => [...prev, {
          id: expertData.id,
          name: expertData.name
        }]);
      }
      
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeExpertFavorite = async (expertId: string) => {
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
      setExpertFavoriteDetails(prev => prev.filter(item => item.id !== expertId));
      
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isExpertFavorite = (expertId: string) => {
    return expertFavorites.includes(expertId);
  };
  
  const toggleExpertFavorite = async (expertId: string) => {
    if (isExpertFavorite(expertId)) {
      return await removeExpertFavorite(expertId);
    } else {
      return await addExpertFavorite(expertId);
    }
  };
  
  // Program favorites implementation
  const addProgramFavorite = async (programId: number) => {
    try {
      console.log('Adding program to favorites:', programId);
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
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setProgramFavorites(prev => [...prev, programId]);
      
      // Fetch the program details to update the details array
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('id, title')
        .eq('id', programId)
        .single();
        
      if (!programError && programData) {
        setProgramFavoriteDetails(prev => [...prev, programData]);
      }
      
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
      console.log('Removing program from favorites:', programId);
      if (!user) {
        toast.error('You must be logged in to remove favorites');
        return false;
      }
      
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programId);
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setProgramFavorites(prev => prev.filter(id => id !== programId));
      setProgramFavoriteDetails(prev => prev.filter(item => item.id !== programId));
      
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
    console.log('Toggling program favorite:', programId, 'Current state:', isProgramFavorite(programId));
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
    toggleProgramFavorite,
    expertFavoriteDetails,
    programFavoriteDetails
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
