
import React, { useEffect } from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { ProgramCategory } from '@/types/programs';
import { useWellnessPrograms } from '@/hooks/useWellnessPrograms';
import WellnessProgramsHeader from '@/components/programs/WellnessProgramsHeader';
import WellnessProgramsContent from '@/components/programs/WellnessProgramsContent';
import { useLocation } from 'react-router-dom';

const ProgramsForWellnessSeekers: React.FC = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const location = useLocation();
  const {
    filteredPrograms,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    programsByCategory
  } = useWellnessPrograms();

  // Handle hash navigation for different program categories
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    if (hash) {
      // Map hash values to category values
      const categoryMap: Record<string, string> = {
        'quick-ease': 'quick-ease',
        'resilience-building': 'resilience-building',
        'super-human': 'super-human',
        'issue-based': 'issue-based'
      };
      
      const mappedCategory = categoryMap[hash];
      if (mappedCategory && mappedCategory !== selectedCategory) {
        setSelectedCategory(mappedCategory);
        
        // Scroll to the programs section after a small delay
        setTimeout(() => {
          const programsSection = document.getElementById('programs-section');
          if (programsSection) {
            programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [location.hash, setSelectedCategory, selectedCategory]);

  // Define all possible category options with explicit typing
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
      <NewNavbar />
      
      <WellnessProgramsHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categoryOptions={allCategoryOptions}
      />
      
      <div id="programs-section">
        <WellnessProgramsContent 
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          filteredPrograms={filteredPrograms}
          programsByCategory={programsByCategory}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
        />
      </div>
      
      <div className="mb-36"></div>
      <Footer />
    </>
  );
};

export default ProgramsForWellnessSeekers;
