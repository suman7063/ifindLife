import React from 'react';
import { expertCategories } from '@/data/expertCategories';

interface ExpertCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

// Hierarchy levels from basic (1) to expert (5)
const categoryHierarchy: Record<string, { level: number; levelLabel: string }> = {
  'listening-volunteer': { level: 1, levelLabel: 'Entry' },
  'listening-expert': { level: 2, levelLabel: 'Intermediate' },
  'mindfulness-expert': { level: 3, levelLabel: 'Advanced' },
  'life-coach': { level: 4, levelLabel: 'Professional' },
  'spiritual-mentor': { level: 5, levelLabel: 'Master' }
};

const ExpertCategoryTabs: React.FC<ExpertCategoryTabsProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const getTabColor = (index: number) => {
    const colors = [
      'text-ifind-teal border-ifind-teal data-[state=active]:bg-ifind-teal data-[state=active]:text-white hover:bg-ifind-teal/10',
      'text-ifind-aqua border-ifind-aqua data-[state=active]:bg-ifind-aqua data-[state=active]:text-white hover:bg-ifind-aqua/10',
      'text-cyan-500 border-cyan-500 data-[state=active]:bg-cyan-500 data-[state=active]:text-white hover:bg-cyan-500/10',
      'text-purple-500 border-purple-500 data-[state=active]:bg-purple-500 data-[state=active]:text-white hover:bg-purple-500/10',
      'text-ifind-purple border-ifind-purple data-[state=active]:bg-ifind-purple data-[state=active]:text-white hover:bg-ifind-purple/10'
    ];
    return colors[index] || colors[0];
  };

  const getActiveBgColor = (index: number) => {
    const colors = ['bg-ifind-teal', 'bg-ifind-aqua', 'bg-cyan-500', 'bg-purple-500', 'bg-ifind-purple'];
    return colors[index] || colors[0];
  };

  const renderLevelIndicator = (categoryId: string, index: number, isActive: boolean) => {
    const hierarchy = categoryHierarchy[categoryId];
    if (!hierarchy) return null;
    
    const totalLevels = 5;
    
    return (
      <div className="flex items-center gap-0.5 mt-1">
        {Array.from({ length: totalLevels }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-3 rounded-full transition-all duration-200 ${
              i < hierarchy.level
                ? isActive 
                  ? 'bg-white/80' 
                  : getActiveBgColor(index)
                : isActive
                  ? 'bg-white/30'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-3">
      {/* Hierarchy label */}
      <div className="flex justify-center mb-2">
        <span className="text-xs text-muted-foreground">
          Basic → Expert
        </span>
      </div>
      
      <div className="flex justify-center gap-2 mb-8">
        {expertCategories.map((category, index) => {
          const isActive = activeCategory === category.id;
          const hierarchy = categoryHierarchy[category.id];
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium
                text-xs sm:text-sm flex flex-col items-center min-w-[100px] sm:min-w-[120px]
                ${isActive 
                  ? getTabColor(index).split(' ').filter(c => c.includes('data-[state=active]')).join(' ').replace(/data-\[state=active\]:/g, '')
                  : getTabColor(index).split(' ').filter(c => !c.includes('data-[state=active]')).join(' ')
                }
              `}
            >
              <span className={`text-[10px] uppercase tracking-wide mb-0.5 ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
                {hierarchy?.levelLabel}
              </span>
              <span>{category.label}</span>
              {renderLevelIndicator(category.id, index, isActive)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertCategoryTabs;