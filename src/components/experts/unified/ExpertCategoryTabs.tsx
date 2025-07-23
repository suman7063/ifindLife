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
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        {expertCategories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="text-xs sm:text-sm"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ExpertCategoryTabs;