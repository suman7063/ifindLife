
import React from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase';
import ProgramCard from './ProgramCard';

interface ProgramGridProps {
  programs: Program[];
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramGrid: React.FC<ProgramGridProps> = ({
  programs,
  currentUser,
  isAuthenticated
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map(program => (
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

export default ProgramGrid;
