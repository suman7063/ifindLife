import { useState, useEffect, useMemo } from 'react';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

interface FavoriteProgram {
  id: string;
  user_id: string;
  program_id: number;
}

interface ProgramDataOptions {
  includeEnrollments?: boolean;
  programType?: ProgramType;
  featured?: boolean;
  withFavorites?: boolean;
}

// Define categoryOptions for use in program filters
export const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'quick-ease', label: 'Quick Ease' },
  { value: 'resilience-building', label: 'Resilience Building' },
  { value: 'super-human', label: 'Super Human' },
  { value: 'issue-based', label: 'Issue Based' },
  { value: 'favorites', label: 'My Favorites' }
];

export const useProgramData = (
  currentUser: UserProfile | null,
  options: ProgramDataOptions = {}
) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<FavoriteProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the options to prevent unnecessary re-fetches
  const memoizedOptions = useMemo(() => options, [
    options.includeEnrollments,
    options.programType,
    options.featured,
    options.withFavorites
  ]);

  // Fetch programs from Supabase
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        // Start building the query
        let query = from('programs').select('*');

        // Add filters based on options
        if (memoizedOptions.programType) {
          query = query.eq('programType', memoizedOptions.programType);
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        setPrograms(data as Program[]);

        // If user is authenticated and we need to mark favorites
        if (currentUser && memoizedOptions.withFavorites) {
          fetchFavorites();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch programs'));
        setLoading(false);
        toast.error('Failed to load programs. Please try again later.');
      }
    };

    // Fetch user's favorite programs
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await from('user_favorite_programs')
          .select('*')
          .eq('user_id', currentUser.id);

        if (error) {
          throw new Error(error.message);
        }

        // Use type assertion to handle the unknown type
        setFavoritePrograms(data as unknown as FavoriteProgram[]);
      } catch (err) {
        console.error('Error fetching favorite programs:', err);
        // Don't show an error toast here as it's not critical
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [currentUser, memoizedOptions]);

  // Mark programs as favorites
  const programsWithFavorites = useMemo(() => {
    if (!memoizedOptions.withFavorites || favoritePrograms.length === 0) {
      return programs;
    }

    return programs.map(program => ({
      ...program,
      is_favorite: favoritePrograms.some(fp => fp.program_id === program.id)
    }));
  }, [programs, favoritePrograms, memoizedOptions.withFavorites]);

  return {
    programs: programsWithFavorites,
    loading,
    error,
    favoritePrograms
  };
};
