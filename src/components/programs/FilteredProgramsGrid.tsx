
import React, { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import ProgramsPagination from './ProgramsPagination';
import EmptyState from './EmptyState';
import ProgramGrid from './ProgramGrid';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedPrograms, setPaginatedPrograms] = useState<Program[]>([]);
  const { toTypeA } = useProfileTypeAdapter();
  const programsPerPage = 6; // Show 6 programs per page (2 rows of 3)
  
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  
  // Reset pagination when category changes or when filtered programs change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filteredPrograms.length]);
  
  // Update paginated programs when page changes or filtered programs change
  useEffect(() => {
    const startIndex = (currentPage - 1) * programsPerPage;
    const endIndex = startIndex + programsPerPage;
    setPaginatedPrograms(filteredPrograms.slice(startIndex, endIndex));
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, filteredPrograms]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Adapt the user profile to type A as required by ProgramGrid
  const adaptedUser = currentUser ? toTypeA(currentUser as any) : null;

  if (filteredPrograms.length === 0) {
    return <EmptyState selectedCategory={selectedCategory} />;
  }

  return (
    <div>
      <ProgramGrid 
        programs={paginatedPrograms}
        currentUser={adaptedUser}
        isAuthenticated={isAuthenticated}
      />
      
      {filteredPrograms.length > programsPerPage && (
        <ProgramsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default FilteredProgramsGrid;
