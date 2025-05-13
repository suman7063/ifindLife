
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProgramCategory } from '@/types/programs';
import ProgramGrid from '@/components/programs/ProgramGrid';
import { UserProfile } from '@/types/supabase';
import { Program } from '@/types/programs';

interface ProgramsTabsProps {
  programs: Record<string, Program[]>;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramsTabs: React.FC<ProgramsTabsProps> = ({ 
  programs, 
  currentUser, 
  isAuthenticated 
}) => {
  // Define colors for each category based on home page
  const categoryColors: Record<string, string> = {
    'issue-based': 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    'quick-ease': 'bg-green-100 border-green-300 hover:bg-green-200',
    'resilience-building': 'bg-purple-100 border-purple-300 hover:bg-purple-200', 
    'super-human': 'bg-orange-100 border-orange-300 hover:bg-orange-200'
  };
  
  // Get category display names
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'issue-based': return 'Issue Based Sessions';
      case 'quick-ease': return 'QuickEase Programs';
      case 'resilience-building': return 'Resilience Building';
      case 'super-human': return 'Super Human Programs';
      default: return category;
    }
  };

  return (
    <Tabs defaultValue="issue-based" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        {Object.keys(programs).map(category => (
          <TabsTrigger 
            key={category} 
            value={category}
            className={`${categoryColors[category]} text-gray-800 font-medium data-[state=active]:border-b-2 data-[state=active]:border-ifind-teal`}
          >
            {getCategoryDisplayName(category)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {Object.entries(programs).map(([category, categoryPrograms]) => (
        <TabsContent key={category} value={category} className="pt-4">
          <h2 className="text-2xl font-bold mb-6">{getCategoryDisplayName(category)}</h2>
          {categoryPrograms.length > 0 ? (
            <ProgramGrid 
              programs={categoryPrograms}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium text-gray-600">No programs available in this category</h3>
              <p className="text-gray-500 mt-2">Please check back later for new programs.</p>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProgramsTabs;
