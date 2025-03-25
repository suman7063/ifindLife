
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchSort from '@/components/experts/SearchSort';
import FilterPanel from '@/components/experts/FilterPanel';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import ExpertsHeader from '@/components/experts/ExpertsHeader';
import { useExpertFilters } from '@/hooks/useExpertFilters';
import { expertData } from '@/data/expertData';

const Experts = () => {
  const {
    filters,
    filterCount,
    filteredExperts,
    handleResetFilters
  } = useExpertFilters(expertData);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ExpertsHeader />
      
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterPanel
              priceRange={filters.priceRange}
              setPriceRange={filters.setPriceRange}
              specialties={filters.specialties}
              setSpecialties={filters.setSpecialties}
              languages={filters.languages}
              setLanguages={filters.setLanguages}
              experience={filters.experience}
              setExperience={filters.setExperience}
              filterCount={filterCount}
              onResetFilters={handleResetFilters}
              showFilters={filters.showFilters}
              setShowFilters={filters.setShowFilters}
            />
            
            <div className="lg:w-3/4">
              <SearchSort
                searchTerm={filters.searchTerm}
                onSearchChange={filters.setSearchTerm}
              />
              
              <ExpertsGrid
                experts={filteredExperts}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Experts;
