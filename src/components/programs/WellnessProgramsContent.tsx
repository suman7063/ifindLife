
import React from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import { Loader2 } from 'lucide-react';
import ProgramCategories from '@/components/programs/ProgramCategories';
import FilteredProgramsGrid from '@/components/programs/FilteredProgramsGrid';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

interface WellnessProgramsContentProps {
  isLoading: boolean;
  selectedCategory: string;
  filteredPrograms: Program[];
  programsByCategory: () => Record<string, Program[]>;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const WellnessProgramsContent: React.FC<WellnessProgramsContentProps> = ({
  isLoading,
  selectedCategory,
  filteredPrograms,
  programsByCategory,
  currentUser,
  isAuthenticated
}) => {
  const { toTypeA } = useProfileTypeAdapter();
  
  // Adapt the user profile to type A as required by other components
  const adaptedUser = currentUser ? toTypeA(currentUser as any) : null;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
      </div>
    );
  }
  
  if (filteredPrograms.length === 0 && selectedCategory === 'all') {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-medium text-gray-600">No programs available</h3>
        <p className="text-gray-500 mt-2">Please check back later for new programs.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-8">
      {selectedCategory === 'all' ? (
        <div className="space-y-10">
          <ProgramCategories 
            programsByCategory={programsByCategory()}
            currentUser={adaptedUser}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ) : (
        <div className="mt-8">
          <FilteredProgramsGrid 
            filteredPrograms={filteredPrograms}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
    </div>
  );
};

export default WellnessProgramsContent;
