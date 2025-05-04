
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/types/expert';
import { Program } from '@/types/programs';
import { useAuth } from '@/contexts/auth/AuthContext';

interface FavoritesContextType {
  favoriteExperts: string[];
  favoritePrograms: number[];
  loading: boolean;
  addExpertToFavorites: (expert: Expert) => Promise<boolean>;
  removeExpertFromFavorites: (expert: Expert) => Promise<boolean>;
  toggleExpertFavorite: (expert: Expert) => Promise<boolean>;
  addProgramToFavorites: (program: Program) => Promise<boolean>;
  removeProgramFromFavorites: (program: Program | number) => Promise<boolean>;
  toggleProgramFavorite: (program: Program) => Promise<boolean>;
  isExpertFavorite: (expertId: string | number) => boolean;
  isProgramFavorite: (programId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteExperts: [],
  favoritePrograms: [],
  loading: false,
  addExpertToFavorites: async () => false,
  removeExpertFromFavorites: async () => false,
  toggleExpertFavorite: async () => false,
  addProgramToFavorites: async () => false,
  removeProgramFromFavorites: async () => false,
  toggleProgramFavorite: async () => false,
  isExpertFavorite: () => false,
  isProgramFavorite: () => false,
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteExperts, setFavoriteExperts] = useState<string[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, userProfile } = useAuth();
  
  // Fetch favorites on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && userProfile?.id) {
      fetchFavorites(userProfile.id);
    } else {
      // Reset favorites if not authenticated
      setFavoriteExperts([]);
      setFavoritePrograms([]);
    }
  }, [isAuthenticated, userProfile?.id]);
  
  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    
    try {
      // Fetch expert favorites
      const { data: expertsData, error: expertsError } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', userId);
        
      if (expertsError) throw expertsError;
      
      const expertIds = expertsData.map(item => String(item.expert_id));
      setFavoriteExperts(expertIds);
      
      // Fetch program favorites
      const { data: programsData, error: programsError } = await supabase
        .from('user_favorite_programs')
        .select('program_id')
        .eq('user_id', userId);
        
      if (programsError) throw programsError;
      
      const programIds = programsData.map(item => Number(item.program_id));
      setFavoritePrograms(programIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const addExpertToFavorites = async (expert: Expert): Promise<boolean> => {
    if (!isAuthenticated || !userProfile?.id) {
      toast.error('You need to log in to add favorites');
      return false;
    }
    
    try {
      const expertId = parseInt(String(expert.id), 10);
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userProfile.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      
      setFavoriteExperts(prev => [...prev, String(expert.id)]);
      toast.success(`Added ${expert.name} to favorites`);
      return true;
    } catch (err) {
      console.error('Error adding expert to favorites:', err);
      toast.error('Failed to add expert to favorites');
      return false;
    }
  };
  
  const removeExpertFromFavorites = async (expert: Expert): Promise<boolean> => {
    if (!isAuthenticated || !userProfile?.id) {
      toast.error('You need to log in to manage favorites');
      return false;
    }
    
    try {
      const expertId = parseInt(String(expert.id), 10);
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertId);
        
      if (error) throw error;
      
      setFavoriteExperts(prev => prev.filter(id => id !== String(expert.id)));
      toast.success(`Removed ${expert.name} from favorites`);
      return true;
    } catch (err) {
      console.error('Error removing expert from favorites:', err);
      toast.error('Failed to remove expert from favorites');
      return false;
    }
  };
  
  const toggleExpertFavorite = async (expert: Expert): Promise<boolean> => {
    const isFavorite = isExpertFavorite(expert.id);
    
    if (isFavorite) {
      return await removeExpertFromFavorites(expert);
    } else {
      return await addExpertToFavorites(expert);
    }
  };
  
  const addProgramToFavorites = async (program: Program): Promise<boolean> => {
    if (!isAuthenticated || !userProfile?.id) {
      toast.error('You need to log in to add favorites');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .insert({
          user_id: userProfile.id,
          program_id: program.id
        });
        
      if (error) throw error;
      
      setFavoritePrograms(prev => [...prev, program.id]);
      toast.success(`Added ${program.title} to favorites`);
      return true;
    } catch (err) {
      console.error('Error adding program to favorites:', err);
      toast.error('Failed to add program to favorites');
      return false;
    }
  };
  
  const removeProgramFromFavorites = async (program: Program | number): Promise<boolean> => {
    if (!isAuthenticated || !userProfile?.id) {
      toast.error('You need to log in to manage favorites');
      return false;
    }
    
    try {
      const programId = typeof program === 'number' ? program : program.id;
      const programTitle = typeof program === 'number' ? 'Program' : program.title;
      
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', userProfile.id)
        .eq('program_id', programId);
        
      if (error) throw error;
      
      setFavoritePrograms(prev => prev.filter(id => id !== programId));
      toast.success(`Removed ${programTitle} from favorites`);
      return true;
    } catch (err) {
      console.error('Error removing program from favorites:', err);
      toast.error('Failed to remove program from favorites');
      return false;
    }
  };
  
  const toggleProgramFavorite = async (program: Program): Promise<boolean> => {
    const isFavorite = isProgramFavorite(program.id);
    
    if (isFavorite) {
      return await removeProgramFromFavorites(program);
    } else {
      return await addProgramToFavorites(program);
    }
  };
  
  const isExpertFavorite = (expertId: string | number): boolean => {
    return favoriteExperts.includes(String(expertId));
  };
  
  const isProgramFavorite = (programId: number): boolean => {
    return favoritePrograms.includes(programId);
  };

  const value = {
    favoriteExperts,
    favoritePrograms,
    loading,
    addExpertToFavorites,
    removeExpertFromFavorites,
    toggleExpertFavorite,
    addProgramToFavorites,
    removeProgramFromFavorites,
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

export const useFavorites = () => useContext(FavoritesContext);
