
import { useState, useEffect, useMemo } from 'react';
import { Program } from '@/types/programs';
import { supabase } from '@/lib/supabase';
import { addSamplePrograms, cleanupIncorrectPrograms } from '@/utils/sampleProgramsData';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';

export const useWellnessPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');

  useEffect(() => {
    const fetchWellnessPrograms = async () => {
      try {
        setIsLoading(true);
        
        // Clean up any incorrectly categorized programs first
        await cleanupIncorrectPrograms();
        
        // Add sample wellness programs
        await addSamplePrograms('wellness');
        
        // Fetch wellness programs from database
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'wellness')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching wellness programs:', error);
          // Fallback to issue-based programs if database fetch fails
          setPrograms(issueBasedPrograms);
          return;
        }

        // Combine database programs with issue-based programs
        const allPrograms = [...(data || []), ...issueBasedPrograms];
        setPrograms(allPrograms);
        
      } catch (error) {
        console.error('Error in fetchWellnessPrograms:', error);
        // Fallback to issue-based programs
        setPrograms(issueBasedPrograms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWellnessPrograms();
  }, []);

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        filtered = programs.filter(program => program.is_favorite);
      } else {
        filtered = programs.filter(program => program.category === selectedCategory);
      }
    }

    // Sort programs
    switch (sortOption) {
      case 'featured':
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.enrollments || 0) - (a.enrollments || 0);
        });
        break;
      case 'popular':
        filtered.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [programs, selectedCategory, sortOption]);

  // Group programs by category
  const programsByCategory = () => {
    const categories: Record<string, Program[]> = {};
    
    programs.forEach(program => {
      if (!categories[program.category]) {
        categories[program.category] = [];
      }
      categories[program.category].push(program);
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
    programsByCategory
  };
};
