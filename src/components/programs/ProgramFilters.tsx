
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ProgramCategory } from '@/types/programs';

interface ProgramFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryOptions: { value: string; label: string }[];
}

const ProgramFilters: React.FC<ProgramFiltersProps> = ({ 
  activeCategory, 
  setActiveCategory,
  categoryOptions
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-1">Category</Label>
        <button
          type="button"
          className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          {categoryOptions.find(option => option.value === activeCategory)?.label || 'Select Category'}
          {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isCategoryOpen && (
          <div className="mt-2 border rounded-md overflow-hidden">
            {categoryOptions.map(category => (
              <button
                key={category.value}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${activeCategory === category.value ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setActiveCategory(category.value);
                  setIsCategoryOpen(false);
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramFilters;
