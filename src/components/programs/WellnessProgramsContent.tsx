
import React from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import ProgramsTabs from '@/components/programs/ProgramsTabs';

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
  filteredPrograms,
  programsByCategory,
  currentUser,
  isAuthenticated
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
      </div>
    );
  }
  
  if (filteredPrograms.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50 container mx-auto px-4 sm:px-6">
        <h3 className="text-xl font-medium text-gray-600">No programs available</h3>
        <p className="text-gray-500 mt-2">Please check back later for new programs.</p>
      </div>
    );
  }

  // Get programs grouped by main categories we want to display as tabs
  const organizedPrograms: Record<string, Program[]> = {
    'issue-based': [],
    'quick-ease': [],
    'resilience-building': [],
    'super-human': []
  };

  // Organize all programs into the main categories
  const allPrograms = programsByCategory();
  Object.entries(allPrograms).forEach(([category, programs]) => {
    if (category in organizedPrograms) {
      organizedPrograms[category] = programs;
    }
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <ProgramsTabs 
        programs={organizedPrograms}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default WellnessProgramsContent;
