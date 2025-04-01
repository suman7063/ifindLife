
import React from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';
import ProgramFilters from '@/components/programs/ProgramFilters';
import ProgramCategories from '@/components/programs/ProgramCategories';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProgramData, categoryOptions } from '@/hooks/useProgramData';

const Programs = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const { 
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    programsByCategory
  } = useProgramData(isAuthenticated, currentUser);

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
            setActiveCategory={setSelectedCategory}
            sortOption={sortOption}
            setSortOption={setSortOption}
            categoryOptions={categoryOptions}
          />
        </div>
        
        {selectedCategory === 'all' ? (
          // Show horizontal scrolling categories when viewing all programs
          <ProgramCategories 
            programsByCategory={programsByCategory}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          // Show grid layout when filtered by category
          <FilteredProgramsGrid 
            filteredPrograms={filteredPrograms}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
      <div className="mb-24"></div>
      <Footer />
    </>
  );
};

export default Programs;
