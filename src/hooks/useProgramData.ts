
import { useState, useEffect, useMemo } from 'react';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { supabase } from '@/lib/supabase';
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
        let query = supabase.from('programs').select('*');

        // Add filters based on options
        if (memoizedOptions.programType) {
          query = query.eq('programType', memoizedOptions.programType);
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // If no data returned, use mock data for development
        if (!data || data.length === 0) {
          setPrograms(getMockPrograms());
        } else {
          // Use type assertion to handle the unknown data structure
          setPrograms((data || []) as unknown as Program[]);
        }

        // If user is authenticated and we need to mark favorites
        if (currentUser && memoizedOptions.withFavorites) {
          fetchFavorites();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        // Use mock data on error for development purposes
        setPrograms(getMockPrograms());
        setError(err instanceof Error ? err : new Error('Failed to fetch programs'));
        setLoading(false);
      }
    };

    // Fetch user's favorite programs
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const { data, error } = await supabase
          .from('user_favorite_programs')
          .select('*')
          .eq('user_id', currentUser.id);

        if (error) {
          throw new Error(error.message);
        }

        // Use type assertion to handle the unknown data structure
        setFavoritePrograms((data || []) as unknown as FavoriteProgram[]);
      } catch (err) {
        console.error('Error fetching favorite programs:', err);
        // Don't show an error toast here as it's not critical
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [currentUser, memoizedOptions]);

  // Mock program data for development and testing
  const getMockPrograms = (): Program[] => {
    return [
      {
        id: 1,
        title: "QuickEase Anxiety Relief",
        description: "Quick techniques to manage anxiety and reduce stress instantly.",
        category: "quick-ease",
        image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        duration_weeks: 1,
        session_frequency: "daily",
        price: 999,
        created_at: new Date().toISOString(),
        is_featured: true
      },
      {
        id: 2,
        title: "Resilience Building Program",
        description: "Develop emotional resilience to overcome life's challenges.",
        category: "resilience-building",
        image_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
        duration_weeks: 8,
        session_frequency: "weekly",
        price: 4999,
        created_at: new Date().toISOString(),
        is_featured: true
      },
      {
        id: 3,
        title: "Super Human Life Program",
        description: "Achieve your highest potential through mental optimization.",
        category: "super-human",
        image_url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
        duration_weeks: 12,
        session_frequency: "weekly",
        price: 9999,
        created_at: new Date().toISOString(),
        is_featured: true
      }
    ];
  };

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
