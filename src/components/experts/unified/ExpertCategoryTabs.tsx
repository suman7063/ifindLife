import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { expertCategories } from '@/data/expertCategories';

interface ExpertCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

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

  return (
    <div className="w-full mb-3">
      <div className="flex justify-center gap-2 mb-8">
        {expertCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium
              text-xs sm:text-sm
              ${activeCategory === category.id 
                ? getTabColor(index).split(' ').filter(c => c.includes('data-[state=active]')).join(' ').replace('data-[state=active]:', '')
                : getTabColor(index).split(' ').filter(c => !c.includes('data-[state=active]')).join(' ')
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpertCategoryTabs;