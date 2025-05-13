
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useWellnessPrograms } from '@/hooks/useWellnessPrograms';
import WellnessProgramsHeader from '@/components/programs/WellnessProgramsHeader';
import WellnessProgramsContent from '@/components/programs/WellnessProgramsContent';
import { useSearchParams } from 'react-router-dom';

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

  const [searchParams] = useSearchParams();
  
  // Handle category selection from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, selectedCategory, setSelectedCategory]);

  // Define all possible category options with explicit typing
  const allCategoryOptions = [
    { value: 'all', label: 'All Programs' },
    { value: 'quick-ease', label: 'QuickEase' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue-Based' },
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
