
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
import expertData from '@/data/expertData'; // Import the expert data
import { ExperienceLevel } from '@/types/experts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    updateFilter,
    resetFilters,
    applyFilters
  } = useExpertFilters(expertData);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('searchQuery', searchTerm);
    applyFilters();
  };

  // Create a type-safe wrapper for the setExperienceLevel function
  const handleExperienceLevelChange = (level: ExperienceLevel) => {
    setExperienceLevel(level);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ExpertsHeader />
      
      <div className="flex-1 bg-gradient-to-b from-white to-gray-50 py-8">
        <Container>
          {/* Search and Sort */}
          <div className="mt-2">
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
                experienceLevel={experienceLevel as ExperienceLevel}
                setExperienceLevel={handleExperienceLevelChange}
                resetFilters={resetFilters}
              />
            )}

            {/* Experts Grid */}
            <div className={`flex-1 ${showFilters ? 'md:w-3/4' : 'w-full'}`}>
              <ExpertsGrid
                experts={filteredExperts as any}
                onResetFilters={resetFilters}
              />
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  );
}
