
import React, { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramFilters from '@/components/programs/ProgramFilters';
import { useUserAuth } from '@/hooks/useUserAuth';
import { from } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import ProgramList from '@/components/programs/ProgramList';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ProgramCategory = 'all' | 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based' | 'favorites';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('popularity');
  const { currentUser, isAuthenticated } = useUserAuth();

  useEffect(() => {
    fetchPrograms();
  }, [isAuthenticated, currentUser]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Fetch all programs
      const { data: programData, error: programError } = await from('programs')
        .select('*');

      if (programError) throw programError;
      
      // Safely cast the data to ensure type safety
      // First cast to unknown and then to Program[] to avoid TypeScript errors
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

  useEffect(() => {
    if (programs.length === 0) return;
    
    // Apply category filter
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
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

  // Group programs by category for horizontal scrolling sections
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

  const handleCategoryChange = (category: ProgramCategory) => {
    setSelectedCategory(category);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based' },
    { value: 'favorites', label: 'Favorites' }
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-8 flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Mental Health Programs</h1>
        
        <div className="mb-8">
          <ProgramFilters 
            activeCategory={selectedCategory}
            setActiveCategory={handleCategoryChange}
            sortOption={sortOption}
            setSortOption={setSortOption}
            categoryOptions={categoryOptions}
          />
        </div>
        
        {selectedCategory === 'all' ? (
          // Show horizontal scrolling categories when viewing all programs
          <div className="space-y-10">
            {Object.entries(programsByCategory()).map(([category, categoryPrograms]) => (
              categoryPrograms.length > 0 && (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold">
                    {category === 'quick-ease' && 'QuickEase'}
                    {category === 'resilience-building' && 'Resilience Building'}
                    {category === 'super-human' && 'Super Human'}
                    {category === 'issue-based' && 'Issue-Based'}
                  </h2>
                  <ScrollArea className="pb-4">
                    <div className="flex space-x-6 pb-2">
                      {categoryPrograms.map(program => (
                        <div key={program.id} className="min-w-[300px] w-[300px]">
                          <ProgramCard 
                            program={program} 
                            currentUser={currentUser}
                            isAuthenticated={isAuthenticated}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )
            ))}
          </div>
        ) : (
          // Show grid layout when filtered by category
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map(program => (
                <ProgramCard 
                  key={program.id} 
                  program={program} 
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                {selectedCategory === 'favorites' 
                  ? "You haven't saved any programs to your favorites yet."
                  : "No programs available in this category."}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Programs;
