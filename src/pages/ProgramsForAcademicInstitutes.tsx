
import React from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import { useProgramData } from '@/hooks/useProgramData';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';

const ProgramsForAcademicInstitutes = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const { 
    filteredPrograms,
    isLoading,
    selectedCategory,
    refreshPrograms
  } = useProgramData(isAuthenticated, currentUser, 'academic');

  // Check for any pending actions from session storage (e.g., after login)
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
        
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4 text-ifind-purple">
            Mental Wellness Solutions for Educational Institutions
          </h2>
          <p className="text-gray-700 mb-6">
            Our specialized programs for academic institutions provide comprehensive mental health support 
            for students, faculty, and staff. Create a healthier learning environment with our evidence-based 
            approaches to mental wellbeing in educational settings.
          </p>
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
