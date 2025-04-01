
import React from 'react';
import { Program } from '@/types/programs';
import ProgramCard from './ProgramCard';
import { UserProfile } from '@/types/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgramListProps {
  programs: Program[];
  isLoading: boolean;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramList: React.FC<ProgramListProps> = ({ 
  programs,
  isLoading,
  currentUser,
  isAuthenticated
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No programs found</h3>
        <p className="text-gray-500 mt-2">Try changing your filter options</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard 
          key={program.id} 
          program={program} 
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

export default ProgramList;
