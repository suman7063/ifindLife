
import { useState, useEffect } from 'react';
import { Program, ProgramCategory, ProgramType } from '@/types/programs';
import { from } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { addSamplePrograms } from '@/utils/sampleProgramsData';

export const useProgramData = (
  isAuthenticated: boolean,
  currentUser: UserProfile | null,
  programType: ProgramType = 'wellness'
) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');

  // Fetch programs on mount or when auth state changes
  useEffect(() => {
    fetchPrograms();
  }, [isAuthenticated, currentUser, programType]);

  // Fetch programs from the database
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Add sample programs if needed
      await addSamplePrograms(programType);
      
      // Fetch programs based on program type
      let query = from('programs').select('*');
      
      // Apply program type filter - important to fetch only the correct program type
      query = query.eq('programType', programType);
      
      const { data: programData, error: programError } = await query;

      if (programError) throw programError;
      
      // Safely cast the data to ensure type safety
      const validProgramData = (programData as unknown) as Program[];
      let programsWithFavorites: Program[] = validProgramData;

      // If user is authenticated, fetch favorites
      if (isAuthenticated && currentUser) {
        const { data: favoritesData, error: favoritesError } = await from('user_favorite_programs')
          .select('program_id')
          .eq('user_id', currentUser.id);

        if (favoritesError) throw favoritesError;

        // Safely cast favorites data to ensure type safety
        const validFavoritesData = (favoritesData as unknown) as { program_id: number }[];

        // Convert favorites data to a Set for faster lookups
        const favoriteProgramIds = new Set(
          validFavoritesData.map(favorite => favorite.program_id)
        );

        // Mark programs as favorites
        programsWithFavorites = programsWithFavorites.map(program => ({
          ...program,
          is_favorite: favoriteProgramIds.has(program.id)
        }));
      }

      // Sort by popularity (number of enrollments) by default
      const sortedPrograms = [...programsWithFavorites].sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
      setPrograms(sortedPrograms);
      setFilteredPrograms(sortedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters when criteria change - only for wellness programs
  useEffect(() => {
    if (programs.length === 0) return;
    
    // Apply category filter for wellness programs
    let categoryFiltered = programs;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        categoryFiltered = programs.filter(program => program.is_favorite);
      } else {
        categoryFiltered = programs.filter(program => program.category === selectedCategory);
      }
    }
    
    // Apply sorting
    const sorted = [...categoryFiltered];
    
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
      default:
        break;
    }
    
    setFilteredPrograms(sorted);
  }, [selectedCategory, programs, sortOption]);

  // Group programs by category
  const programsByCategory = () => {
    const categories: Record<string, Program[]> = {
      'quick-ease': [],
      'resilience-building': [],
      'super-human': [],
      'issue-based': []
    };
    
    programs.forEach(program => {
      if (program.category in categories) {
        categories[program.category].push(program);
      }
    });
    
    return categories;
  };

  return {
    programs,
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    programsByCategory: programsByCategory(),
    refreshPrograms: fetchPrograms
  };
};

export const categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[] = [
  { value: 'all', label: 'All Programs' },
  { value: 'quick-ease', label: 'QuickEase' },
  { value: 'resilience-building', label: 'Resilience Building' },
  { value: 'super-human', label: 'Super Human' },
  { value: 'issue-based', label: 'Issue-Based' },
  { value: 'favorites', label: 'Favorites' }
];
