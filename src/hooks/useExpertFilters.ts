
import { useState, useEffect, useMemo } from 'react';
import { ExtendedExpert } from '@/types/programs';

type ExperienceLevel = 'any' | 'beginner' | 'intermediate' | 'experienced';

export function useExpertFilters(initialExperts: ExtendedExpert[] = []) {
  // State for filters
  const [experts, setExperts] = useState<ExtendedExpert[]>(initialExperts);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('any');
  const [sortOption, setSortOption] = useState<string>('recommended');

  // Update experts if initialExperts changes
  useEffect(() => {
    setExperts(initialExperts);
  }, [initialExperts]);

  // Get all available specialties from experts
  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>();
    experts.forEach(expert => {
      if (expert.specialties) {
        expert.specialties.forEach(specialty => {
          specialtiesSet.add(specialty);
        });
      }
    });
    return Array.from(specialtiesSet).sort();
  }, [experts]);

  // Get all available languages from experts
  const allLanguages = useMemo(() => {
    const languagesSet = new Set<string>();
    experts.forEach(expert => {
      if (expert.languages) {
        expert.languages.forEach(language => {
          if (language) languagesSet.add(language);
        });
      }
    });
    return Array.from(languagesSet).sort();
  }, [experts]);

  // Filter experts based on selected filters
  const filteredExperts = useMemo(() => {
    return experts.filter(expert => {
      // Filter by search term
      if (
        searchTerm &&
        !expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !expert.specialties?.some(s => 
          s.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by price range
      const expertPrice = 
        expert.pricing?.consultation_fee || 
        expert.pricing?.price_per_min || 
        0;
        
      if (expertPrice < priceRange[0] || expertPrice > priceRange[1]) {
        return false;
      }

      // Filter by specialties
      if (
        selectedSpecialties.length > 0 &&
        !selectedSpecialties.some(specialty => 
          expert.specialties?.includes(specialty)
        )
      ) {
        return false;
      }

      // Filter by languages
      if (
        selectedLanguages.length > 0 &&
        (!expert.languages || !selectedLanguages.some(language => 
          expert.languages?.includes(language)
        ))
      ) {
        return false;
      }

      // Filter by experience level
      if (experienceLevel !== 'any' && expert.experience) {
        // Check if experience is a string
        const experienceStr = typeof expert.experience === 'string' ? expert.experience : String(expert.experience);
        const yearsMatch = experienceStr.match(/(\d+)/);
        
        if (yearsMatch) {
          const years = parseInt(yearsMatch[0], 10);
          
          if (experienceLevel === 'beginner' && years >= 5) {
            return false;
          } else if (experienceLevel === 'intermediate' && (years < 5 || years > 10)) {
            return false;
          } else if (experienceLevel === 'experienced' && years <= 10) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    experts,
    searchTerm,
    priceRange,
    selectedSpecialties,
    selectedLanguages,
    experienceLevel,
  ]);

  // Apply sorting to filtered experts
  const sortedExperts = useMemo(() => {
    let sorted = [...filteredExperts];

    switch (sortOption) {
      case 'price_low':
        return sorted.sort((a, b) => {
          const priceA = a.pricing?.consultation_fee || a.pricing?.price_per_min || 0;
          const priceB = b.pricing?.consultation_fee || b.pricing?.price_per_min || 0;
          return priceA - priceB;
        });
      case 'price_high':
        return sorted.sort((a, b) => {
          const priceA = a.pricing?.consultation_fee || a.pricing?.price_per_min || 0;
          const priceB = b.pricing?.consultation_fee || b.pricing?.price_per_min || 0;
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'experience':
        return sorted.sort((a, b) => {
          // Convert experience to string if it's a number
          const expA = typeof a.experience === 'string' ? a.experience : String(a.experience || '');
          const expB = typeof b.experience === 'string' ? b.experience : String(b.experience || '');
          
          const yearsA = expA.match(/(\d+)/)?.[0] ?? '0';
          const yearsB = expB.match(/(\d+)/)?.[0] ?? '0';
          
          return parseInt(yearsB) - parseInt(yearsA);
        });
      case 'recommended':
      default:
        return sorted;
    }
  }, [filteredExperts, sortOption]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 5000]);
    setSelectedSpecialties([]);
    setSelectedLanguages([]);
    setExperienceLevel('any');
    setSortOption('recommended');
  };

  return {
    experts,
    filteredExperts: sortedExperts,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedSpecialties,
    setSelectedSpecialties,
    selectedLanguages,
    setSelectedLanguages,
    experienceLevel,
    setExperienceLevel,
    sortOption,
    setSortOption,
    resetFilters,
    allSpecialties,
    allLanguages,
  };
}
