
import React, { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramFilters from '@/components/programs/ProgramFilters';
import { useUserAuth } from '@/hooks/useUserAuth';
import { from } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import ProgramList from '@/components/programs/ProgramList';

type ProgramCategory = 'all' | 'quick-ease' | 'resilience-building' | 'super-human' | 'issue-based' | 'favorites';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useUserAuth();

  useEffect(() => {
    fetchPrograms();
  }, [isAuthenticated, currentUser]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Fetch all programs
      const { data: programData, error: programError } = await from('programs')
        .select('*')
        .order('created_at', { ascending: false });

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

      setPrograms(programsWithFavorites);
      setFilteredPrograms(programsWithFavorites);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPrograms(programs);
    } else if (selectedCategory === 'favorites') {
      setFilteredPrograms(programs.filter(program => program.is_favorite));
    } else {
      setFilteredPrograms(programs.filter(program => program.category === selectedCategory));
    }
  }, [selectedCategory, programs]);

  const handleCategoryChange = (category: ProgramCategory) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mental Health Programs</h1>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as ProgramCategory)} className="mb-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 w-full">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="quick-ease">QuickEase</TabsTrigger>
          <TabsTrigger value="resilience-building">Resilience</TabsTrigger>
          <TabsTrigger value="super-human">Super Human</TabsTrigger>
          <TabsTrigger value="issue-based">Issue-Based</TabsTrigger>
          <TabsTrigger value="favorites" disabled={!isAuthenticated}>Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedCategory}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Programs;
