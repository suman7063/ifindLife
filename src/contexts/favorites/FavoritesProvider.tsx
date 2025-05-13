import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

interface FavoritesContextProps {
  favoriteExperts: string[];
  favoritePrograms: string[];
  toggleFavoriteExpert: (expertId: string) => void;
  toggleFavoriteProgram: (programId: string) => void;
  isFavoriteExpert: (expertId: string) => boolean;
  isFavoriteProgram: (programId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<string[]>([]);

  // Get auth context
  const auth = useAuth();
  
  // Fix reference to userProfile
  const userId = auth.profile?.id;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;

      try {
        // Fetch favorite experts
        const { data: expertFavorites, error: expertError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', userId);

        if (expertError) {
          console.error("Error fetching favorite experts:", expertError);
        } else {
          const expertIds = expertFavorites ? expertFavorites.map(fav => String(fav.expert_id)) : [];
          setFavoriteExperts(expertIds);
        }

        // Fetch favorite programs
        const { data: programFavorites, error: programError } = await supabase
          .from('user_favorite_programs')
          .select('program_id')
          .eq('user_id', userId);

        if (programError) {
          console.error("Error fetching favorite programs:", programError);
        } else {
          const programIds = programFavorites ? programFavorites.map(fav => String(fav.program_id)) : [];
          setFavoritePrograms(programIds);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavoriteExpert = async (expertId: string) => {
    if (!userId) return;

    const isCurrentlyFavorite = favoriteExperts.includes(expertId);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('expert_id', parseInt(expertId));

        if (error) {
          console.error("Error removing favorite expert:", error);
        } else {
          setFavoriteExperts(prev => prev.filter(id => id !== expertId));
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: userId, expert_id: parseInt(expertId) }]);

        if (error) {
          console.error("Error adding favorite expert:", error);
        } else {
          setFavoriteExperts(prev => [...prev, expertId]);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite expert:", error);
    }
  };

  const toggleFavoriteProgram = async (programId: string) => {
    if (!userId) return;

    const isCurrentlyFavorite = favoritePrograms.includes(programId);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_programs')
          .delete()
          .eq('user_id', userId)
          .eq('program_id', parseInt(programId));

        if (error) {
          console.error("Error removing favorite program:", error);
        } else {
          setFavoritePrograms(prev => prev.filter(id => id !== programId));
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_programs')
          .insert([{ user_id: userId, program_id: parseInt(programId) }]);

        if (error) {
          console.error("Error adding favorite program:", error);
        } else {
          setFavoritePrograms(prev => [...prev, programId]);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite program:", error);
    }
  };

  const isFavoriteExpert = (expertId: string) => {
    return favoriteExperts.includes(expertId);
  };

  const isFavoriteProgram = (programId: string) => {
    return favoritePrograms.includes(programId);
  };

  const value: FavoritesContextProps = {
    favoriteExperts,
    favoritePrograms,
    toggleFavoriteExpert,
    toggleFavoriteProgram,
    isFavoriteExpert,
    isFavoriteProgram,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
