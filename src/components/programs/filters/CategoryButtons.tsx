
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProgramCategory } from '@/types/programs';

interface CategoryButtonsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ 
  activeCategory, 
  setActiveCategory,
  categoryOptions
}) => {
  return (
    <div className="flex flex-wrap gap-2 w-full justify-center">
      {categoryOptions.map(category => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(category.value)}
          className="sm:inline-flex"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryButtons;
