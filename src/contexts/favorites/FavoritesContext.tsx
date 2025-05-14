
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Program } from '@/types/programs';
import { toast } from 'sonner';

interface FavoritesContextType {
  expertFavorites: string[];
  programFavorites: number[];
  expertFavoriteDetails: any[];
  programFavoriteDetails: Program[];
  isExpertFavorite: (id: string | number) => boolean;
  isProgramFavorite: (id: number) => boolean;
  toggleExpertFavorite: (id: string | number) => Promise<boolean>;
  toggleProgramFavorite: (id: number) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  expertFavorites: [],
  programFavorites: [],
  expertFavoriteDetails: [],
  programFavoriteDetails: [],
  isExpertFavorite: () => false,
  isProgramFavorite: () => false,
  toggleExpertFavorite: async () => false,
  toggleProgramFavorite: async () => false,
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userProfile } = useAuth();
  const [expertFavorites, setExpertFavorites] = useState<string[]>([]);
  const [programFavorites, setProgramFavorites] = useState<number[]>([]);
  const [expertFavoriteDetails, setExpertFavoriteDetails] = useState<any[]>([]);
  const [programFavoriteDetails, setProgramFavoriteDetails] = useState<Program[]>([]);

  // Initialize favorites from user profile
  useEffect(() => {
    if (userProfile) {
      // Expert favorites from profile
      const favExperts = userProfile.favorite_experts || [];
      setExpertFavorites(favExperts.map(id => String(id)));
      
      // Program favorites - handle both string[] and number[] types
      const favPrograms = userProfile.favorite_programs || [];
      setProgramFavorites(favPrograms.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id)));
    }
  }, [userProfile]);

  // Fetch favorite details when favorites change
  useEffect(() => {
    const fetchExpertFavoriteDetails = async () => {
      if (expertFavorites.length === 0) {
        setExpertFavoriteDetails([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .in('id', expertFavorites);
          
        if (error) throw error;
        setExpertFavoriteDetails(data || []);
      } catch (error) {
        console.error('Error fetching expert favorites:', error);
      }
    };
    
    const fetchProgramFavoriteDetails = async () => {
      if (programFavorites.length === 0) {
        setProgramFavoriteDetails([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .in('id', programFavorites);
          
        if (error) throw error;
        setProgramFavoriteDetails(data || []);
      } catch (error) {
        console.error('Error fetching program favorites:', error);
      }
    };
    
    if (isAuthenticated) {
      fetchExpertFavoriteDetails();
      fetchProgramFavoriteDetails();
    }
  }, [expertFavorites, programFavorites, isAuthenticated]);

  const isExpertFavorite = (id: string | number): boolean => {
    return expertFavorites.includes(String(id));
  };
  
  const isProgramFavorite = (id: number): boolean => {
    return programFavorites.includes(id);
  };
  
  const toggleExpertFavorite = async (id: string | number): Promise<boolean> => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to save favorites');
      return false;
    }
    
    try {
      const stringId = String(id);
      const isFavorite = isExpertFavorite(id);
      
      let updatedFavorites: string[];
      if (isFavorite) {
        updatedFavorites = expertFavorites.filter(favId => favId !== stringId);
      } else {
        updatedFavorites = [...expertFavorites, stringId];
      }
      
      // Update database
      const { error } = await supabase
        .from('users')
        .update({ favorite_experts: updatedFavorites })
        .eq('id', userProfile.id);
        
      if (error) throw error;
      
      // Update local state
      setExpertFavorites(updatedFavorites);
      
      toast.success(isFavorite 
        ? 'Expert removed from favorites' 
        : 'Expert added to favorites');
        
      return true;
    } catch (error) {
      console.error('Error toggling expert favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  };
  
  const toggleProgramFavorite = async (id: number): Promise<boolean> => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to save favorites');
      return false;
    }
    
    try {
      const isFavorite = isProgramFavorite(id);
      
      let updatedFavorites: number[];
      if (isFavorite) {
        updatedFavorites = programFavorites.filter(favId => favId !== id);
      } else {
        updatedFavorites = [...programFavorites, id];
      }
      
      // Update user_favorite_programs table
      if (!isFavorite) {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('user_favorite_programs')
          .insert({ user_id: userProfile.id, program_id: id });
          
        if (insertError) throw insertError;
      } else {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_favorite_programs')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('program_id', id);
          
        if (deleteError) throw deleteError;
      }
      
      // Update users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ favorite_programs: updatedFavorites.map(String) })
        .eq('id', userProfile.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setProgramFavorites(updatedFavorites);
      
      toast.success(isFavorite 
        ? 'Program removed from favorites' 
        : 'Program added to favorites');
        
      return true;
    } catch (error) {
      console.error('Error toggling program favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  };

  return (
    <FavoritesContext.Provider value={{
      expertFavorites,
      programFavorites,
      expertFavoriteDetails,
      programFavoriteDetails,
      isExpertFavorite,
      isProgramFavorite,
      toggleExpertFavorite,
      toggleProgramFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
