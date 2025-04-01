
import React, { useEffect } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';
import ProgramFilters from '@/components/programs/ProgramFilters';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProgramData, categoryOptions } from '@/hooks/useProgramData';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';

const ProgramsForAcademicInstitutes = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const { 
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    refreshPrograms
  } = useProgramData(isAuthenticated, currentUser, 'resilience-building');

  // Check for any pending actions from session storage (e.g., after login)
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const pendingAction = sessionStorage.getItem('pendingAction');
      const pendingProgramId = sessionStorage.getItem('pendingProgramId');
      
      if (pendingAction && pendingProgramId) {
        const programId = parseInt(pendingProgramId);
        
        // Handle pending actions
        if (pendingAction === 'favorite') {
          handlePendingFavorite(programId);
        } else if (pendingAction === 'enroll') {
          // Redirect to the program detail page for enrollment
          window.location.href = `/program/${programId}`;
        }
        
        // Clear pending actions
        sessionStorage.removeItem('pendingAction');
        sessionStorage.removeItem('pendingProgramId');
      }
    }
  }, [isAuthenticated, currentUser]);

  const handlePendingFavorite = async (programId: number) => {
    try {
      // Check if already a favorite
      const { data, error: checkError } = await from('user_favorite_programs')
        .select('*')
        .eq('user_id', currentUser?.id)
        .eq('program_id', programId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (!data) {
        // Add to favorites
        const { error } = await from('user_favorite_programs')
          .insert({
            user_id: currentUser?.id,
            program_id: programId
          });
          
        if (error) throw error;
        
        toast.success('Added to favorites');
        refreshPrograms(); // Refresh to update UI
      }
    } catch (error) {
      console.error('Error handling pending favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

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
        <h1 className="text-3xl font-bold mb-8 text-center">Programs For Academic Institutes</h1>
        
        <div className="mb-8">
          <ProgramFilters 
            activeCategory={selectedCategory}
            setActiveCategory={setSelectedCategory}
            sortOption={sortOption}
            setSortOption={setSortOption}
            categoryOptions={categoryOptions}
          />
        </div>
        
        <FilteredProgramsGrid 
          filteredPrograms={filteredPrograms}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForAcademicInstitutes;
