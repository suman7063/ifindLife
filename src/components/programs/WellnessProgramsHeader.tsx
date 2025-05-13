
import React from 'react';
import SortButton from '@/components/programs/filters/SortButton';
import { ProgramCategory } from '@/types/programs';

interface WellnessProgramsHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
}

const WellnessProgramsHeader: React.FC<WellnessProgramsHeaderProps> = ({
  sortOption,
  setSortOption
}) => {
  return (
    <div className="bg-gradient-to-r from-ifind-offwhite to-white py-12 border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programs for Wellness Seekers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover our range of mental wellness programs designed to help you thrive. From quick relief to long-term resilience building, find the support you need.
          </p>
        </div>
        
        <div className="flex justify-end mt-6">
          <SortButton sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>
    </div>
  );
};

export default WellnessProgramsHeader;
