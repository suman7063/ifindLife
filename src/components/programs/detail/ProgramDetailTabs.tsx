
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
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-shrink-0 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-ifind-aqua text-ifind-aqua"
                : "border-transparent text-ifind-charcoal/70 hover:text-ifind-charcoal hover:border-ifind-teal/50"
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
