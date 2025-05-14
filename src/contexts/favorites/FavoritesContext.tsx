
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext'; 
import { toast } from 'sonner';

export interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  error: string | null;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  isFavorite: (expertId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: false,
  error: null,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from profile when user profile changes
  useEffect(() => {
    if (userProfile && userProfile.favorite_experts) {
      // Ensure IDs are all strings
      setFavorites(userProfile.favorite_experts.map(id => String(id)));
      setLoading(false);
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [userProfile]);

  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return false;
    }

    try {
      setLoading(true);
      
      // Add to local state immediately for optimistic UI update
      setFavorites(prev => [...prev, expertId]);
      
      // In a real app, update the user profile with the new favorite
      // For now, we'll just simulate success
      setTimeout(() => {
        setLoading(false);
        toast.success('Expert added to favorites');
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err);
      
      // Rollback optimistic update
      setFavorites(prev => prev.filter(id => id !== expertId));
      setError('Failed to add to favorites');
      setLoading(false);
      
      return false;
    }
  };

  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage favorites');
      return false;
    }

    try {
      setLoading(true);
      
      // Remove from local state immediately for optimistic UI update
      setFavorites(prev => prev.filter(id => id !== expertId));
      
      // In a real app, update the user profile 
      // For now, we'll just simulate success
      setTimeout(() => {
        setLoading(false);
        toast.success('Expert removed from favorites');
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      
      // Rollback optimistic update
      setFavorites(prev => [...prev, expertId]);
      setError('Failed to remove from favorites');
      setLoading(false);
      
      return false;
    }
  };

  const isFavorite = (expertId: string): boolean => {
    return favorites.includes(expertId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      error,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
