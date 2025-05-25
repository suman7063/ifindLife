
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ProgramCategory } from '@/types/programs';
import { useWellnessPrograms } from '@/hooks/useWellnessPrograms';
import WellnessProgramsHeader from '@/components/programs/WellnessProgramsHeader';
import WellnessProgramsContent from '@/components/programs/WellnessProgramsContent';

const ProgramsForWellnessSeekers: React.FC = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const {
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    programsByCategory
  } = useWellnessPrograms();

  // Define all possible category options with explicit typing including issue-based
  const allCategoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[] = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based Sessions' },
    { value: 'favorites', label: 'My Favorites' }
  ];

  return (
    <>
      <Navbar />
      
      <WellnessProgramsHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryOptions={allCategoryOptions}
      />
      
      <WellnessProgramsContent 
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        filteredPrograms={filteredPrograms}
        programsByCategory={programsByCategory}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
      
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForWellnessSeekers;
