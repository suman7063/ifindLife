import { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import { supabase } from '@/lib/supabase';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';

export const useWellnessPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const { programFavorites, isProgramFavorite } = useFavorites();

  // Fetch programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching wellness programs...');
        
        await addSamplePrograms('wellness');
        
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', 'wellness');
          
        if (error) {
          console.error('Error fetching wellness programs:', error);
          return;
        }
        
        console.log('Wellness programs fetched:', data);
        
        if (data) {
          const databasePrograms: Program[] = data.map(program => ({
            id: program.id,
            title: program.title,
            description: program.description,
            duration: program.duration,
            sessions: program.sessions,
            price: program.price,
            image: program.image,
            category: program.category as Program['category'],
            programType: program.programType as Program['programType'],
            enrollments: program.enrollments || 0,
            created_at: program.created_at,
            is_favorite: isProgramFavorite(program.id)
          }));
          
          // Combine database programs with issue-based programs
          const allPrograms = [...databasePrograms, ...issueBasedPrograms.map(program => ({
            ...program,
            is_favorite: isProgramFavorite(program.id)
          }))];
          
          const sortedPrograms = [...allPrograms].sort((a, b) => 
            (b.enrollments || 0) - (a.enrollments || 0)
          );
          
          const categoryCounts = {
            'quick-ease': sortedPrograms.filter(p => p.category === 'quick-ease').length,
            'resilience-building': sortedPrograms.filter(p => p.category === 'resilience-building').length,
            'super-human': sortedPrograms.filter(p => p.category === 'super-human').length,
            'issue-based': sortedPrograms.filter(p => p.category === 'issue-based').length
          };
          
          console.log('Programs by category count:', categoryCounts);
          console.log('Setting wellness programs to state:', sortedPrograms);
          
          setPrograms(sortedPrograms);
          setFilteredPrograms(sortedPrograms);
        }
      } catch (error) {
        console.error('Error in wellness programs fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrograms();
  }, [isProgramFavorite]);

  // Apply category and sort filters
  useEffect(() => {
    if (programs.length === 0) return;
    
    console.log('Applying filters. Category:', selectedCategory, 'Sort option:', sortOption);
    console.log('Current favorites:', programFavorites);
    
    let categoryFiltered = [...programs];
    
    // Update favorite status based on current programFavorites array
    categoryFiltered = categoryFiltered.map(program => ({
      ...program,
      is_favorite: isProgramFavorite(program.id)
    }));
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        categoryFiltered = categoryFiltered.filter(program => isProgramFavorite(program.id));
        console.log("Filtered favorites:", categoryFiltered);
      } else {
        categoryFiltered = categoryFiltered.filter(program => program.category === selectedCategory);
      }
    }
    
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
      default:
        sorted.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
    }
    
    console.log('Filtered programs count:', sorted.length);
    setFilteredPrograms(sorted);
  }, [selectedCategory, programs, sortOption, programFavorites, isProgramFavorite]);

  // Organize programs by category
  const programsByCategory = () => {
    const categories: Record<string, Program[]> = {
      'quick-ease': [],
      'resilience-building': [],
      'super-human': [],
      'issue-based': []
    };
    
    programs.forEach(program => {
      if (program.category in categories) {
        categories[program.category].push({
          ...program,
          is_favorite: isProgramFavorite(program.id)
        });
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
    programsByCategory
  };
};
