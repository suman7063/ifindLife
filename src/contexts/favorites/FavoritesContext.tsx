
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

interface FavoritesContextType {
  expertFavorites: string[];
  programFavorites: number[];
  isExpertFavorite: (expertId: string | number) => boolean;
  isProgramFavorite: (programId: string | number) => boolean;
  toggleExpertFavorite: (expertId: string | number) => Promise<boolean>;
  toggleProgramFavorite: (programId: string | number) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const [expertFavorites, setExpertFavorites] = useState<string[]>([]);
  const [programFavorites, setProgramFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch favorites on mount and when user changes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching favorites for user:', user.id);
        
        // Fetch expert favorites
        const { data: expertData, error: expertError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', user.id);
          
        if (expertError) {
          console.error('Error fetching expert favorites:', expertError);
          throw expertError;
        }
        
        console.log('Expert favorites data:', expertData);
        setExpertFavorites(expertData?.map(item => item.expert_id) || []);
        
        // Fetch program favorites
        const { data: programData, error: programError } = await supabase
          .from('user_favorite_programs')
          .select('program_id')
          .eq('user_id', user.id);
          
        if (programError) {
          console.error('Error fetching program favorites:', programError);
          throw programError;
        }
        
        console.log('Program favorites data:', programData);
        setProgramFavorites(programData?.map(item => item.program_id) || []);
        
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching favorites'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
    
    // If we have userProfile data already, sync with any favorites from there
    if (userProfile) {
      if (Array.isArray(userProfile.favorite_experts)) {
        setExpertFavorites(prevState => {
          const combinedFavorites = [...new Set([...prevState, ...userProfile.favorite_experts])];
          console.log('Synced expert favorites from user profile:', combinedFavorites);
          return combinedFavorites;
        });
      }
      
      if (Array.isArray(userProfile.favorite_programs)) {
        setProgramFavorites(prevState => {
          const combinedFavorites = [...new Set([...prevState, ...userProfile.favorite_programs])];
          console.log('Synced program favorites from user profile:', combinedFavorites);
          return combinedFavorites;
        });
      }
    }
  }, [user?.id, isAuthenticated, userProfile]);

  // Check if an item is favorite
  const isExpertFavorite = (expertId: string | number): boolean => {
    const stringId = String(expertId);
    return expertFavorites.includes(stringId);
  };
  
  const isProgramFavorite = (programId: string | number): boolean => {
    const numId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    return programFavorites.includes(numId);
  };
  
  // Toggle expert favorite status
  const toggleExpertFavorite = async (expertId: string | number): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please log in to save favorites');
      return false;
    }
    
    setIsLoading(true);
    const stringId = String(expertId);
    
    try {
      if (isExpertFavorite(stringId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: user.id, expert_id: stringId });
          
        if (error) throw error;
        
        setExpertFavorites(prev => prev.filter(id => id !== stringId));
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, expert_id: stringId });
          
        if (error) throw error;
        
        setExpertFavorites(prev => [...prev, stringId]);
        toast.success('Added to favorites');
      }
      
      return true;
    } catch (err) {
      console.error('Error toggling expert favorite:', err);
      setError(err instanceof Error ? err : new Error('Unknown error updating favorites'));
      toast.error('Failed to update favorites');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle program favorite status
  const toggleProgramFavorite = async (programId: string | number): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please log in to save favorites');
      return false;
    }
    
    setIsLoading(true);
    const numId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    
    try {
      if (isProgramFavorite(numId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_programs')
          .delete()
          .match({ user_id: user.id, program_id: numId });
          
        if (error) throw error;
        
        setProgramFavorites(prev => prev.filter(id => id !== numId));
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_programs')
          .insert({ user_id: user.id, program_id: numId });
          
        if (error) throw error;
        
        setProgramFavorites(prev => [...prev, numId]);
        toast.success('Added to favorites');
      }
      
      return true;
    } catch (err) {
      console.error('Error toggling program favorite:', err);
      setError(err instanceof Error ? err : new Error('Unknown error updating favorites'));
      toast.error('Failed to update favorites');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create the context value
  const value: FavoritesContextType = {
    expertFavorites,
    programFavorites,
    isExpertFavorite,
    isProgramFavorite,
    toggleExpertFavorite,
    toggleProgramFavorite,
    isLoading,
    error
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
