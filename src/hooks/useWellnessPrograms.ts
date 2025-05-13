
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { useProgramData } from '@/hooks/useProgramData';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';

export const useWellnessPrograms = () => {
  const { currentUser } = useUserAuth();
  const { programFavorites } = useFavorites();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popular');
  
  // Fetch programs data
  const { programs, loading: isLoading } = useProgramData(currentUser, {
    programType: 'wellness',
    withFavorites: true
  });
  
  // Filter programs based on selected category and favorites
  const filteredPrograms = useMemo(() => {
    if (selectedCategory === 'all') {
      return sortPrograms(programs, sortOption);
    }
    
    if (selectedCategory === 'favorites') {
      // Fix: Ensure we're handling favoriteIds correctly and properly check for null values
      const favoriteIds = new Set(
        programFavorites
          .filter(fav => fav !== null) // Filter out null values first
          .map(fav => {
            if (typeof fav === 'object' && fav !== null && 'program_id' in fav) {
              return fav.program_id;
            }
            return fav;
          })
      );
      
      return sortPrograms(
        programs.filter(program => favoriteIds.has(program.id)),
        sortOption
      );
    }
    
    return sortPrograms(
      programs.filter(program => program.category === selectedCategory),
      sortOption
    );
  }, [programs, selectedCategory, sortOption, programFavorites]);
  
  // Group programs by category
  const programsByCategory = useCallback(() => {
    const categories: Record<string, Program[]> = {
      'quick-ease': [],
      'resilience-building': [],
      'super-human': [],
      'issue-based': []
    };
    
    programs.forEach(program => {
      const category = program.category as string;
      if (category in categories) {
        categories[category].push(program);
      } else {
        // If a program has a category not in our predefined list
        if (!categories['other']) {
          categories['other'] = [];
        }
        categories['other'].push(program);
      }
    });
    
    // Sort programs in each category
    Object.keys(categories).forEach(key => {
      categories[key] = sortPrograms(categories[key], sortOption);
    });
    
    return categories;
  }, [programs, sortOption]);
  
  return {
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    programsByCategory
  };
};

// Helper function to sort programs
const sortPrograms = (programs: Program[], sortOption: string): Program[] => {
  const sortedPrograms = [...programs];
  
  switch (sortOption) {
    case 'newest':
      return sortedPrograms.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'price-low':
      return sortedPrograms.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedPrograms.sort((a, b) => b.price - a.price);
    case 'popular':
    default:
      // Sort by enrollments (if available) or default to id
      return sortedPrograms.sort((a, b) => 
        (b.enrollments || 0) - (a.enrollments || 0)
      );
  }
};
