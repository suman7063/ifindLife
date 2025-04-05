
import { useState, useCallback } from 'react';
import { Expert } from '@/types/expert';
import { ExtendedExpert } from '@/types/programs';

interface FilterState {
  searchQuery: string;
  selectedLanguages: string[];
  selectedSpecialties: string[];
  priceRange: [number, number];
  experienceLevel: string;
  availability: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export const useExpertFilters = (initialExperts: ExtendedExpert[]) => {
  const [experts, setExperts] = useState<ExtendedExpert[]>(initialExperts);
  const [filteredExperts, setFilteredExperts] = useState<ExtendedExpert[]>(initialExperts);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedLanguages: [],
    selectedSpecialties: [],
    priceRange: [0, 5000],
    experienceLevel: 'Any',
    availability: 'Any',
    sortBy: 'rating',
    sortDirection: 'desc'
  });

  // Extract available languages from experts data
  const getAvailableLanguages = useCallback(() => {
    const languagesSet = new Set<string>();
    
    experts.forEach(expert => {
      if (expert.languages) {
        expert.languages.forEach(lang => languagesSet.add(lang));
      }
    });
    
    return Array.from(languagesSet).sort();
  }, [experts]);

  // Extract available specialties from experts data
  const getAvailableSpecialties = useCallback(() => {
    const specialtiesSet = new Set<string>();
    
    experts.forEach(expert => {
      if (expert.specialties) {
        expert.specialties.forEach(specialty => specialtiesSet.add(specialty));
      }
    });
    
    return Array.from(specialtiesSet).sort();
  }, [experts]);

  // Get price range (min, max) from experts data
  const getPriceRange = useCallback(() => {
    let min = Infinity;
    let max = 0;
    
    experts.forEach(expert => {
      const price = expert.pricing?.consultation_fee || 0;
      min = Math.min(min, price);
      max = Math.max(max, price);
    });
    
    return [min === Infinity ? 0 : min, max];
  }, [experts]);

  // Apply filters
  const applyFilters = useCallback(() => {
    let result = [...experts];
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(expert => {
        const nameMatch = expert.name.toLowerCase().includes(query);
        const specialtyMatch = expert.specialties?.some(s => 
          typeof s === 'string' && s.toLowerCase().includes(query)
        );
        
        return nameMatch || specialtyMatch;
      });
    }
    
    // Apply language filter
    if (filters.selectedLanguages.length > 0) {
      result = result.filter(expert => {
        return expert.languages?.some(lang => filters.selectedLanguages.includes(lang));
      });
    }
    
    // Apply specialty filter
    if (filters.selectedSpecialties.length > 0) {
      result = result.filter(expert => {
        return expert.specialties?.some(specialty => filters.selectedSpecialties.includes(specialty));
      });
    }
    
    // Apply price filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(expert => {
        const price = expert.pricing?.consultation_fee || 0;
        return price >= min && price <= max;
      });
    }
    
    // Apply sort
    if (filters.sortBy) {
      result.sort((a, b) => {
        let valueA, valueB;
        
        switch (filters.sortBy) {
          case 'price':
            valueA = a.pricing?.consultation_fee || 0;
            valueB = b.pricing?.consultation_fee || 0;
            break;
          case 'rating':
            valueA = a.rating || 0;
            valueB = b.rating || 0;
            break;
          default:
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            return (filters.sortDirection === 'asc') 
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
        }
        
        return (filters.sortDirection === 'asc') 
          ? valueA - valueB 
          : valueB - valueA;
      });
    }
    
    setFilteredExperts(result);
    return result;
  }, [experts, filters]);

  const updateFilter = (filterName: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedLanguages: [],
      selectedSpecialties: [],
      priceRange: getPriceRange(),
      experienceLevel: 'Any',
      availability: 'Any',
      sortBy: 'rating',
      sortDirection: 'desc'
    });
  };

  return {
    experts,
    setExperts,
    filteredExperts,
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    getAvailableLanguages,
    getAvailableSpecialties,
    getPriceRange
  };
};
