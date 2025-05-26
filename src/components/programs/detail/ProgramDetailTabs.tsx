
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgramDetailTabsProps {
  activeTab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews';
  onTabChange: (tab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews') => void;
}

const ProgramDetailTabs: React.FC<ProgramDetailTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'structure', label: 'Course Structure' },
    { id: 'coverage', label: 'What It Covers' },
    { id: 'outcomes', label: 'Expected Outcomes' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' }
  ] as const;

  return (
    <div className="border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-shrink-0 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-ifind-teal text-ifind-teal"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgramDetailTabs;
