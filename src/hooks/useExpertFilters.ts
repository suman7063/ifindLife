
import { useState, useMemo } from 'react';
import { ExtendedExpert } from '@/types/programs';

export const useExpertFilters = (experts: ExtendedExpert[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredAndSortedExperts = useMemo(() => {
    let filtered = experts.filter(expert => {
      const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expert.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialization = selectedSpecialization === 'all' || 
                                   expert.specialization === selectedSpecialization;
      
      return matchesSearch && matchesSpecialization;
    });

    // Sort experts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        case 'experience':
          const aExp = parseInt(a.experience || '0');
          const bExp = parseInt(b.experience || '0');
          return bExp - aExp;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [experts, searchTerm, selectedSpecialization, sortBy]);

  const specializations = useMemo(() => {
    const specs = experts
      .map(expert => expert.specialization)
      .filter((spec): spec is string => Boolean(spec))
      .filter((spec, index, arr) => arr.indexOf(spec) === index);
    
    return ['all', ...specs];
  }, [experts]);

  return {
    searchTerm,
    setSearchTerm,
    selectedSpecialization,
    setSelectedSpecialization,
    sortBy,
    setSortBy,
    filteredAndSortedExperts,
    specializations
  };
};
