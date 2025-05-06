
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define favorites context types
interface FavoritesContextType {
  favoriteExperts: string[];
  favoritePrograms: number[];
  isLoading: boolean;
  addExpertToFavorites: (expertId: string) => Promise<void>;
  removeExpertFromFavorites: (expertId: string) => Promise<void>;
  addProgramToFavorites: (programId: number) => Promise<void>;
  removeProgramFromFavorites: (programId: number) => Promise<void>;
  isExpertFavorite: (expertId: string) => boolean;
  isProgramFavorite: (programId: number) => boolean;
  
  // Add the missing properties and methods
  expertFavorites: string[];
  programFavorites: number[];
  toggleExpertFavorite: (expertId: string) => Promise<boolean>;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
}

// Create favorites context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Favorites provider component
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated, updateProfile } = useAuth();
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on auth change
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFavoriteExperts(userProfile.favorite_experts || []);
      setFavoritePrograms(userProfile.favorite_programs || []);
    } else {
      setFavoriteExperts([]);
      setFavoritePrograms([]);
    }
    setIsLoading(false);
  }, [isAuthenticated, userProfile]);

  // Add expert to favorites
  const addExpertToFavorites = async (expertId: string) => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to add favorites');
      return;
    }

    try {
      setIsLoading(true);
      const updatedFavorites = [...favoriteExperts, expertId];
      
      const success = await updateProfile({
        favorite_experts: updatedFavorites
      });
      
      if (success) {
        setFavoriteExperts(updatedFavorites);
        toast.success('Expert added to favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding expert to favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove expert from favorites
  const removeExpertFromFavorites = async (expertId: string) => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to manage favorites');
      return;
    }

    try {
      setIsLoading(true);
      const updatedFavorites = favoriteExperts.filter(id => id !== expertId);
      
      const success = await updateProfile({
        favorite_experts: updatedFavorites
      });
      
      if (success) {
        setFavoriteExperts(updatedFavorites);
        toast.success('Expert removed from favorites');
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error removing expert from favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Add program to favorites
  const addProgramToFavorites = async (programId: number) => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to add favorites');
      return;
    }

    try {
      setIsLoading(true);
      const updatedFavorites = [...favoritePrograms, programId];
      
      const success = await updateProfile({
        favorite_programs: updatedFavorites
      });
      
      if (success) {
        setFavoritePrograms(updatedFavorites);
        toast.success('Program added to favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding program to favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove program from favorites
  const removeProgramFromFavorites = async (programId: number) => {
    if (!isAuthenticated || !userProfile) {
      toast.error('Please log in to manage favorites');
      return;
    }

    try {
      setIsLoading(true);
      const updatedFavorites = favoritePrograms.filter(id => id !== programId);
      
      const success = await updateProfile({
        favorite_programs: updatedFavorites
      });
      
      if (success) {
        setFavoritePrograms(updatedFavorites);
        toast.success('Program removed from favorites');
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error removing program from favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle expert favorite status
  const toggleExpertFavorite = async (expertId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage favorites');
      return false;
    }
    
    try {
      const isFavorite = favoriteExperts.includes(expertId);
      
      if (isFavorite) {
        await removeExpertFromFavorites(expertId);
      } else {
        await addExpertToFavorites(expertId);
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling expert favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  };
  
  // Toggle program favorite status
  const toggleProgramFavorite = async (programId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage favorites');
      return false;
    }
    
    try {
      const isFavorite = favoritePrograms.includes(programId);
      
      if (isFavorite) {
        await removeProgramFromFavorites(programId);
      } else {
        await addProgramToFavorites(programId);
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling program favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  };

  // Check if expert is in favorites
  const isExpertFavorite = (expertId: string) => {
    return favoriteExperts.includes(expertId);
  };

  // Check if program is in favorites
  const isProgramFavorite = (programId: number) => {
    return favoritePrograms.includes(programId);
  };

  // Create context value
  const value: FavoritesContextType = {
    favoriteExperts,
    favoritePrograms,
    expertFavorites: favoriteExperts, // Add alias for backward compatibility
    programFavorites: favoritePrograms, // Add alias for backward compatibility
    isLoading,
    addExpertToFavorites,
    removeExpertFromFavorites,
    addProgramToFavorites,
    removeProgramFromFavorites,
    toggleExpertFavorite,
    toggleProgramFavorite,
    isExpertFavorite,
    isProgramFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook for using favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
};
