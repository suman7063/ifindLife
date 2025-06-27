
import React from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';
import ProgramCard from './ProgramCard';

interface ProgramGridProps {
  programs: Program[];
  loading?: boolean;
  user?: UserProfile | any;
  isAuthenticated?: boolean; // Added missing prop
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
}

const ProgramGrid: React.FC<ProgramGridProps> = ({
  programs,
  loading = false,
  user,
  isAuthenticated = false, // Added default value
  onProgramClick,
  onFavoriteToggle
}) => {
  // Adapt user profile to ensure consistent structure
  const adaptedUser = user ? adaptUserProfile(user) : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          currentUser={adaptedUser}
          isAuthenticated={isAuthenticated}
          onProgramClick={onProgramClick}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default ProgramGrid;
