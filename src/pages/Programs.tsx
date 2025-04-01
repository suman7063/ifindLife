
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgramList from '@/components/programs/ProgramList';
import ProgramFilters from '@/components/programs/ProgramFilters';
import TrendingPrograms from '@/components/programs/TrendingPrograms';
import { useUserAuth } from '@/hooks/user-auth';
import { from, supabase } from '@/lib/supabase';
import { Program } from '@/types/programs';
import { ProgramCategory } from '@/types/programs';
import { useNavigate } from 'react-router-dom';
import { fixProgramImages } from '@/utils/programImageFix';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
    // Check for pending actions after login
    handlePendingActions();
    // Fix broken program images
    fixProgramImages();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchFavoritePrograms();
    }
  }, [isAuthenticated, currentUser]);

  const handlePendingActions = () => {
    if (isAuthenticated && currentUser) {
      const pendingAction = sessionStorage.getItem('pendingAction');
      const pendingProgramId = sessionStorage.getItem('pendingProgramId');
      
      if (pendingAction && pendingProgramId) {
        const programId = parseInt(pendingProgramId);
        
        // Clear stored data
        sessionStorage.removeItem('pendingAction');
        sessionStorage.removeItem('pendingProgramId');
        
        // Handle different actions
        switch (pendingAction) {
          case 'favorite':
            navigate(`/program/${programId}`);
            break;
          case 'enroll':
            navigate(`/program/${programId}`);
            break;
          case 'view':
            navigate(`/program/${programId}`);
            break;
          default:
            break;
        }
      }
    }
  };

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      let query = from('programs').select('*').order('created_at', { ascending: false });
      
      // If authenticated, get favorite status
      if (isAuthenticated && currentUser) {
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Get user's favorite programs
          const { data: favoritesData, error: favoritesError } = await from('user_favorite_programs')
            .select('program_id')
            .eq('user_id', currentUser.id);
            
          if (favoritesError) throw favoritesError;
          
          // Create a set of favorite program IDs for quick lookup
          const favoriteIds = new Set((favoritesData || []).map(f => f.program_id));
          
          // Mark favorite programs
          const typedData = data.map(program => ({
            ...program,
            is_favorite: favoriteIds.has(program.id)
          })) as unknown as Program[];
          
          setPrograms(typedData);
          setFilteredPrograms(typedData);
        }
      } else {
        // Regular fetch without favorites
        const { data, error } = await query;
        
        if (error) throw error;
        
        const typedData = data as unknown as Program[];
        setPrograms(typedData);
        setFilteredPrograms(typedData);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoritePrograms = async () => {
    if (!isAuthenticated || !currentUser) return;
    
    setIsFavoritesLoading(true);
    try {
      // Get favorite program IDs
      const { data: favoriteIds, error: favoriteError } = await from('user_favorite_programs')
        .select('program_id')
        .eq('user_id', currentUser.id);
        
      if (favoriteError) throw favoriteError;
      
      if (favoriteIds && favoriteIds.length > 0) {
        // Get the actual programs
        const programIds = favoriteIds.map(f => f.program_id);
        
        const { data: favoritePrograms, error: programsError } = await from('programs')
          .select('*')
          .in('id', programIds);
          
        if (programsError) throw programsError;
        
        // Mark all as favorites
        const typedFavorites = (favoritePrograms || []).map(program => ({
          ...program,
          is_favorite: true
        })) as unknown as Program[];
        
        setFavoritePrograms(typedFavorites);
      } else {
        setFavoritePrograms([]);
      }
    } catch (error) {
      console.error('Error fetching favorite programs:', error);
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "favorites") {
      // No additional filtering for favorites tab
      setFilteredPrograms(favoritePrograms);
    } else {
      filterPrograms();
    }
  }, [activeCategory, sortOption, programs, activeTab, favoritePrograms]);

  const filterPrograms = () => {
    let result = [...programs];
    
    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(program => program.category === activeCategory);
    }
    
    // Sort programs
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0));
        break;
      case "newest":
      default:
        // Already sorted by created_at in the query
        break;
    }
    
    setFilteredPrograms(result);
  };

  const categoryOptions: { value: ProgramCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based Programs' }
  ];

  const getProgramsByCategory = (category: ProgramCategory) => {
    return programs.filter(program => program.category === category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-ifind-charcoal text-white py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Mental Wellness Programs</h1>
          <p className="text-ifind-offwhite/80">Structured programs designed to support your mental health journey</p>
        </div>
      </div>
      
      <main className="flex-1 py-10">
        <div className="container mb-12">
          <TrendingPrograms programs={programs.filter(p => p.enrollments && p.enrollments > 0).sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0)).slice(0, 6)} />
        </div>
        
        <div className="container">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              if (value === "all") {
                setActiveCategory("all");
              }
            }}
            className="mb-8"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all">
              <div className="flex flex-col space-y-8 mb-12">
                <ProgramFilters 
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  categoryOptions={categoryOptions}
                />
                
                {activeCategory === "all" ? (
                  <>
                    {categoryOptions.filter(cat => cat.value !== 'all').map((category) => (
                      <div key={category.value} className="mb-12">
                        <div className="border-b pb-2 mb-6">
                          <h2 className="text-2xl font-bold">{category.label}</h2>
                          <p className="text-muted-foreground mt-1">
                            {category.value === 'quick-ease' && 'Short programs for immediate relief'}
                            {category.value === 'resilience-building' && 'Build long-term emotional strength'}
                            {category.value === 'super-human' && 'Advanced programs for exceptional growth'}
                            {category.value === 'issue-based' && 'Focused programs for specific challenges'}
                          </p>
                        </div>
                        <ProgramList 
                          programs={getProgramsByCategory(category.value as ProgramCategory)} 
                          isLoading={isLoading} 
                          currentUser={currentUser}
                          isAuthenticated={isAuthenticated}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <ProgramList 
                    programs={filteredPrograms} 
                    isLoading={isLoading} 
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">My Favorite Programs</h2>
                <p className="text-muted-foreground">Programs you've saved for later</p>
              </div>
              
              <ProgramList 
                programs={favoritePrograms} 
                isLoading={isFavoritesLoading} 
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                emptyMessage="You haven't added any programs to your favorites yet."
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
