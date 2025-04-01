
import React from 'react';
import { Program } from '@/types/programs';
import ProgramCard from './ProgramCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile } from '@/types/supabase';

interface ProgramCategoriesProps {
  programsByCategory: Record<string, Program[]>;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramCategories: React.FC<ProgramCategoriesProps> = ({
  programsByCategory,
  currentUser,
  isAuthenticated
}) => {
  // Helper function to get category display name
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'quick-ease': return 'QuickEase';
      case 'resilience-building': return 'Resilience Building';
      case 'super-human': return 'Super Human';
      case 'issue-based': return 'Issue-Based';
      default: return category;
    }
  };

  return (
    <div className="space-y-10">
      {Object.entries(programsByCategory).map(([category, categoryPrograms]) => (
        categoryPrograms.length > 0 && (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {getCategoryDisplayName(category)}
            </h2>
            <ScrollArea className="pb-4">
              <div className="flex space-x-6 pb-2">
                {categoryPrograms.map(program => (
                  <div key={program.id} className="min-w-[300px] max-w-[300px]">
                    <ProgramCard 
                      program={program} 
                      currentUser={currentUser}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )
      ))}
    </div>
  );
};

export default ProgramCategories;
