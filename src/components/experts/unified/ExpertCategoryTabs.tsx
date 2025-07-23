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
    <div className="w-full mb-6">
      {/* Aqua/Teal background strip */}
      <div className="bg-gradient-to-r from-ifind-teal to-ifind-aqua p-1 rounded-lg shadow-lg">
        <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm">
            {expertCategories.map((category, index) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className={`
                  text-xs sm:text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-white data-[state=active]:shadow-md
                  ${index < 2 
                    ? 'data-[state=active]:text-ifind-teal hover:text-ifind-teal' 
                    : 'data-[state=active]:text-ifind-purple hover:text-ifind-purple'
                  }
                `}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertCategoryTabs;