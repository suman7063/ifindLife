import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ProgramCategory } from '@/types/programs';

interface ProgramFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ProgramFilters: React.FC<ProgramFiltersProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory 
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'quick-ease', label: 'Quick Ease' },
    { value: 'resilience-building', label: 'Resilience Building' },
    { value: 'super-human', label: 'Super Human' },
    { value: 'issue-based', label: 'Issue Based' },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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
