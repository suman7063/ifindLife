import React from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import ProgramGrid from './ProgramGrid';

interface Props {
  filteredPrograms: Program[];
  currentUser?: UserProfile | any;
  isAuthenticated: boolean;
  selectedCategory: string;
  user?: any;
  programs?: Program[];
  [key: string]: any;
}

const FilteredProgramsGrid: React.FC<Props> = ({
  filteredPrograms,
  currentUser,
  isAuthenticated,
  selectedCategory,
  ...otherProps
}) => {
  if (filteredPrograms.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-medium text-gray-600">
          No {selectedCategory.replace('_', ' ')} programs found
        </h3>
        <p className="text-gray-500 mt-2">
          Please check back later for new programs in this category.
        </p>
      </div>
    );
  }

  return (
    <ProgramGrid
      programs={filteredPrograms}
      user={currentUser}
      isAuthenticated={isAuthenticated}
      {...otherProps}
    />
  );
};

export default FilteredProgramsGrid;
