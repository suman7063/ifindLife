
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProgramCategory } from '@/types/programs';
import { Tag } from 'lucide-react';

interface CategoryButtonsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites'; label: string }[];
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ 
  activeCategory, 
  setActiveCategory,
  categoryOptions
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categoryOptions.map(category => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(category.value)}
          className={`whitespace-nowrap ${
            activeCategory === category.value 
              ? 'bg-ifind-teal hover:bg-ifind-teal/90' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Tag className="h-4 w-4 mr-2" />
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryButtons;
