
import React, { useState, useEffect } from 'react';
import { Program } from '@/types/programs';
import ProgramCard from './ProgramCard';
import { UserProfile } from '@/types/supabase';
import ProgramsPagination from './ProgramsPagination';

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPrograms.map(program => (
          <div key={program.id} className="w-full">
            <ProgramCard 
              program={program} 
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ))}
      </div>
      
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
