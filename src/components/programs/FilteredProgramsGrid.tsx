
import React from 'react';
import { Program } from '@/types/programs';
import ProgramCard from './ProgramCard';
import { UserProfile } from '@/types/supabase';

interface FilteredProgramsGridProps {
  filteredPrograms: Program[];
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  selectedCategory: string;
}

const FilteredProgramsGrid: React.FC<FilteredProgramsGridProps> = ({
  filteredPrograms,
  currentUser,
  isAuthenticated,
  selectedCategory
}) => {
  if (filteredPrograms.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-muted-foreground">
        {selectedCategory === 'favorites' 
          ? "You haven't saved any programs to your favorites yet."
          : "No programs available in this category."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPrograms.map(program => (
        <div key={program.id} className="w-full">
          <ProgramCard 
            program={program} 
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
};

export default FilteredProgramsGrid;
