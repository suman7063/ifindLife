
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import ExpertsHeader from '@/components/experts/ExpertsHeader';
import FilterPanel from '@/components/experts/FilterPanel';
import SearchSort from '@/components/experts/SearchSort';
import { useExpertFilters } from '@/hooks/useExpertFilters';
import { expertData } from '@/data/expertData'; // Import the expert data
import { ExtendedExpert } from '@/types/programs';

export default function Experts() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Use the hook for filtering
  const {
    filteredExperts,
    priceRange,
    setPriceRange,
    selectedSpecialties,
    setSelectedSpecialties,
    selectedLanguages,
    setSelectedLanguages,
    experienceLevel,
    setExperienceLevel,
    resetFilters,
  } = useExpertFilters(expertData as ExtendedExpert[]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in real-time in the filter hook
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <Container className="py-8 md:py-12">
        {/* Header */}
        <ExpertsHeader />

        {/* Search and Sort */}
        <div className="mt-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search experts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <SearchSort
            expertCount={filteredExperts.length}
            onToggleFilters={toggleFilters}
            showFilters={showFilters}
          />
        </div>

        {/* Main Content */}
        <div className="mt-6 flex flex-col md:flex-row gap-8">
          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              experienceLevel={experienceLevel}
              setExperienceLevel={setExperienceLevel}
              resetFilters={resetFilters}
            />
          )}

          {/* Experts Grid */}
          <div className={`flex-1 ${showFilters ? 'md:w-3/4' : 'w-full'}`}>
            <ExpertsGrid
              experts={filteredExperts}
              onResetFilters={resetFilters}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
