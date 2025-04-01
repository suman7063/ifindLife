
import React from 'react';
import CategoryButtons from './filters/CategoryButtons';
import SortButton from './filters/SortButton';
import MobileFilterSheet from './filters/MobileFilterSheet';
import { ProgramCategory } from '@/types/programs';

interface ProgramFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
}

const ProgramFilters: React.FC<ProgramFiltersProps> = ({ 
  activeCategory, 
  setActiveCategory, 
  sortOption, 
  setSortOption,
  categoryOptions
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CategoryButtons 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          categoryOptions={categoryOptions}
        />
        
        <div className="w-full sm:w-auto flex">
          <SortButton 
            sortOption={sortOption} 
            setSortOption={setSortOption} 
          />
          
          <div className="w-full sm:hidden">
            <MobileFilterSheet 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
              categoryOptions={categoryOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramFilters;
