
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import CategoryButtons from '@/components/programs/filters/CategoryButtons';
import ProgramSortOptions from '@/components/programs/filters/ProgramSortOptions';
import { ProgramCategory } from '@/types/programs';

interface WellnessProgramsHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
}

const WellnessProgramsHeader: React.FC<WellnessProgramsHeaderProps> = ({
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  categoryOptions
}) => {
  return (
    <>
      <PageHeader 
        title="Programs For Wellness Seekers" 
        subtitle="Discover mental wellness programs designed to support your personal growth and wellbeing"
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-ifind-purple">
              Personalized Mental Wellness Programs
            </h2>
            
            <ProgramSortOptions 
              sortOption={sortOption} 
              setSortOption={setSortOption} 
            />
          </div>
          
          <p className="text-gray-700 mb-6">
            Our wellness programs are designed to support individuals on their mental health journey.
            Choose from a variety of evidence-based programs tailored to address specific needs and goals.
          </p>
          
          {/* Category buttons for quick filtering */}
          <CategoryButtons 
            activeCategory={selectedCategory}
            setActiveCategory={setSelectedCategory}
            categoryOptions={categoryOptions}
          />
        </div>
      </div>
    </>
  );
};

export default WellnessProgramsHeader;
