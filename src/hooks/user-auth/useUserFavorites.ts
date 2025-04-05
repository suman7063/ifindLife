import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Program } from '@/types/programs';
import { Expert } from '@/types/expert';

interface FavoriteProgram {
  program_id: number;
  user_id: string;
}

interface FavoriteExpert {
  expert_id: number | string;
  user_id: string;
}

export const useUserFavorites = (userId: string) => {
  const [favoritePrograms, setFavoritePrograms] = useState<FavoriteProgram[]>([]);
  const [favoriteExperts, setFavoriteExperts] = useState<FavoriteExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Fetch favorite programs
        const { data: programData, error: programError } = await supabase
          .from('user_favorite_programs')
          .select('*')
          .eq('user_id', userId);

        if (programError) {
          throw new Error(programError.message);
        }

        setFavoritePrograms((programData || []) as FavoriteProgram[]);

        // Fetch favorite experts
        const { data: expertData, error: expertError } = await supabase
          .from('user_favorite_experts')
          .select('*')
          .eq('user_id', userId);

        if (expertError) {
          throw new Error(expertError.message);
        }

        setFavoriteExperts((expertData || []) as FavoriteExpert[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch favorites'));
        toast.error('Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const addProgramToFavorites = async (programId: number) => {
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .insert({
          user_id: userId,
          program_id: programId
        });

      if (error) {
        throw new Error(error.message);
      }

      setFavoritePrograms(prev => [...prev, { user_id: userId, program_id: programId }]);
      toast.success('Program added to favorites');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add program to favorites'));
      toast.error('Failed to add program to favorites');
    }
  };

  const removeProgramFromFavorites = async (programId: number) => {
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId);

      if (error) {
        throw new Error(error.message);
      }

      setFavoritePrograms(prev => prev.filter(fav => fav.program_id !== programId));
      toast.success('Program removed from favorites');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove program from favorites'));
      toast.error('Failed to remove program from favorites');
    }
  };

  const toggleExpertFavorite = async (e: Expert | null) => {
    if (!e) {
      console.error('Cannot toggle favorite for null expert');
      return;
    }
    
    const expertId = e.id;
    if (!expertId) {
      console.error('Expert has no ID');
      return;
    }

    try {
      const isFavorite = favoriteExperts.some(fav => String(fav.expert_id) === String(expertId));

      if (isFavorite) {
        await removeExpertFromFavorites(expertId);
      } else {
        await addExpertToFavorites(e);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle expert favorite'));
      toast.error('Failed to toggle expert favorite');
    }
  };

  const addExpertToFavorites = async (expert: Expert | null) => {
    if (!expert) {
      console.error('Cannot add null expert to favorites');
      return;
    }
    
    const expertId = expert.id;
    if (!expertId) {
      console.error('Expert has no ID');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorite_experts')
        .insert({
          user_id: userId,
          expert_id: expertId
        });

      if (error) {
        throw new Error(error.message);
      }

      setFavoriteExperts(prev => [...prev, { user_id: userId, expert_id: expertId }]);
      toast.success('Expert added to favorites');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add expert to favorites'));
      toast.error('Failed to add expert to favorites');
    }
  };

  const removeExpertFromFavorites = async (expertId: number | string) => {
    try {
      const { error } = await supabase
        .from('user_favorite_experts')
        .delete()
        .eq('user_id', userId)
        .eq('expert_id', expertId);

      if (error) {
        throw new Error(error.message);
      }

      setFavoriteExperts(prev => prev.filter(fav => String(fav.expert_id) !== String(expertId)));
      toast.success('Expert removed from favorites');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove expert from favorites'));
      toast.error('Failed to remove expert from favorites');
    }
  };

  return {
    favoritePrograms,
    favoriteExperts,
    loading,
    error,
    addProgramToFavorites,
    removeProgramFromFavorites,
    toggleExpertFavorite,
    addExpertToFavorites,
    removeExpertFromFavorites
  };
};
