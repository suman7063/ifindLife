
import React, { useState, useEffect } from 'react';
import { Program, ProgramCategory } from '@/types/programs';
import ProgramCard from '@/components/programs/ProgramCard';
import ProgramFilters from '@/components/programs/ProgramFilters';
import { useUserAuth } from '@/hooks/useUserAuth';
import { from } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  // Add sample programs to the database
  useEffect(() => {
    if (programs.length > 0) {
      addSamplePrograms();
    }
  }, [programs]);

  const addSamplePrograms = async () => {
    // Check if we already have enough programs
    const existingCounts = {
      'quick-ease': programs.filter(p => p.category === 'quick-ease').length,
      'resilience-building': programs.filter(p => p.category === 'resilience-building').length,
      'super-human': programs.filter(p => p.category === 'super-human').length,
      'issue-based': programs.filter(p => p.category === 'issue-based').length
    };
    
    // Only add sample programs if there are fewer than 3 in a category
    const samplePrograms = [];
    
    if (existingCounts['quick-ease'] < 3) {
      samplePrograms.push({
        title: "Stress Relief Quick Program",
        description: "A short program designed to help you quickly reduce stress and anxiety through guided meditation and breathing exercises.",
        duration: "2 weeks",
        sessions: 6,
        price: 1999,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Sleep Enhancement Program",
        description: "Improve your sleep quality with this short but effective program featuring relaxation techniques and sleep hygiene practices.",
        duration: "10 days",
        sessions: 5,
        price: 1499,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2xlZXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
    
    if (existingCounts['resilience-building'] < 3) {
      samplePrograms.push({
        title: "Bounce Back Stronger",
        description: "Build emotional resilience with this comprehensive program that teaches coping mechanisms for life's challenges.",
        duration: "8 weeks",
        sessions: 16,
        price: 4499,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzaWxpZW5jZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Emotional Strength Training",
        description: "Learn to process difficult emotions and develop the strength to face life's challenges with confidence.",
        duration: "6 weeks",
        sessions: 12,
        price: 3999,
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RyZW5ndGh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
    
    if (existingCounts['super-human'] < 3) {
      samplePrograms.push({
        title: "Peak Performance Mindset",
        description: "Unlock your full potential with advanced cognitive techniques and performance psychology principles.",
        duration: "12 weeks",
        sessions: 24,
        price: 6999,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Mental Mastery Elite",
        description: "Join our most comprehensive program for those seeking to achieve elite mental performance in all areas of life.",
        duration: "3 months",
        sessions: 36,
        price: 8999,
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFzdGVyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
    
    if (existingCounts['issue-based'] < 3) {
      samplePrograms.push({
        title: "Anxiety Freedom Program",
        description: "A targeted program designed specifically to help you overcome anxiety with evidence-based approaches.",
        duration: "6 weeks",
        sessions: 12,
        price: 3499,
        image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW54aWV0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Depression Recovery Path",
        description: "Find your way back to joy and motivation with this comprehensive program for managing depression.",
        duration: "8 weeks",
        sessions: 16,
        price: 4999,
        image: "https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVjb3Zlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
    
    // Only add programs if we have any to add
    if (samplePrograms.length > 0) {
      try {
        for (const program of samplePrograms) {
          await from('programs').insert(program);
        }
        // Refresh programs after adding samples
        fetchPrograms();
      } catch (error) {
        console.error('Error adding sample programs:', error);
      }
    }
  };

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[] = [
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
        <div className="container mx-auto px-4 sm:px-6 py-8 flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8">
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
                        <div key={program.id} className="min-w-[300px] max-w-[300px]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map(program => (
                <div key={program.id} className="w-full">
                  <ProgramCard 
                    program={program} 
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
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
      <div className="mb-16"></div>
      <Footer />
    </>
  );
};

export default Programs;
