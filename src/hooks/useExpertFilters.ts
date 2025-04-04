import { useState, useEffect, useMemo } from 'react';
import { Expert } from '@/types/expert';
import { ExtendedExpert } from '@/types/programs';

export interface FilterState {
  searchTerm: string;
  priceRange: number[];
  specialties: {
    anxiety: boolean;
    depression: boolean;
    stress: boolean;
    relationships: boolean;
    trauma: boolean;
    selfEsteem: boolean;
  };
  languages: {
    english: boolean;
    hindi: boolean;
    tamil: boolean;
    telugu: boolean;
    kannada: boolean;
  };
  experience: {
    lessThan5: boolean;
    between5And10: boolean;
    moreThan10: boolean;
  };
}

export const useExpertFilters = (expertData: Expert[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  // Filter state
  const [specialties, setSpecialties] = useState({
    anxiety: false,
    depression: false,
    stress: false,
    relationships: false,
    trauma: false,
    selfEsteem: false,
  });
  
  const [languages, setLanguages] = useState({
    english: false,
    hindi: false,
    tamil: false,
    telugu: false,
    kannada: false,
  });

  const [experience, setExperience] = useState({
    lessThan5: false,
    between5And10: false,
    moreThan10: false,
  });

  const handleResetFilters = () => {
    setSpecialties({
      anxiety: false,
      depression: false,
      stress: false,
      relationships: false,
      trauma: false,
      selfEsteem: false,
    });
    setLanguages({
      english: false,
      hindi: false,
      tamil: false,
      telugu: false,
      kannada: false,
    });
    setExperience({
      lessThan5: false,
      between5And10: false,
      moreThan10: false,
    });
    setPriceRange([0, 100]);
    setFilterCount(0);
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.values(specialties).forEach(value => { if (value) count++; });
    Object.values(languages).forEach(value => { if (value) count++; });
    Object.values(experience).forEach(value => { if (value) count++; });
    if (priceRange[0] > 0 || priceRange[1] < 100) count++;
    setFilterCount(count);
  }, [specialties, languages, experience, priceRange]);

  // Filter function
  const filteredExperts = useMemo(() => {
    const applyPriceFilter = (experts: ExtendedExpert[], minPrice: number, maxPrice: number | null) => {
      return experts.filter(expert => {
        const expertPrice = expert.price || 0;
        if (maxPrice === null) {
          return expertPrice >= minPrice;
        }
        return expertPrice >= minPrice && expertPrice <= maxPrice;
      });
    };

    const applySpecialtyFilter = (experts: ExtendedExpert[], selectedSpecialties: string[]) => {
      if (!selectedSpecialties.length) return experts;
      
      return experts.filter(expert => 
        expert.specialties?.some(specialty => 
          selectedSpecialties.includes(specialty)
        )
      );
    };

    const applyLanguageFilter = (experts: ExtendedExpert[], selectedLanguages: string[]) => {
      if (!selectedLanguages.length) return experts;
      
      return experts.filter(expert => 
        expert.languages?.some(language => 
          selectedLanguages.includes(language)
        )
      );
    };

    const applyExperienceFilter = (experts: ExtendedExpert[], experienceLevel: string) => {
      if (!experienceLevel) return experts;
      
      return experts.filter(expert => {
        const years = parseInt(expert.experience || '0', 10);
        
        if (experienceLevel === 'beginner') {
          return years < 5;
        } else if (experienceLevel === 'intermediate') {
          return years >= 5 && years < 10;
        } else {
          return years >= 10;
        }
      });
    };

    return expertData.filter((expert) => {
      // Apply search filter
      if (searchTerm && !expert.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply price filter
      if (expert.price < priceRange[0] || expert.price > priceRange[1]) {
        return false;
      }
      
      // Apply specialties filter
      const hasSelectedSpecialty = Object.values(specialties).some(value => value);
      if (hasSelectedSpecialty) {
        const expertSpecialtiesLower = expert.specialties.map(s => s.toLowerCase());
        const matchesSpecialty = Object.entries(specialties).some(([key, value]) => {
          return value && expertSpecialtiesLower.includes(key.toLowerCase());
        });
        if (!matchesSpecialty) return false;
      }
      
      // Apply language filter
      const hasSelectedLanguage = Object.values(languages).some(value => value);
      if (hasSelectedLanguage) {
        const expertLanguagesLower = expert.languages.map(l => l.toLowerCase());
        const matchesLanguage = Object.entries(languages).some(([key, value]) => {
          return value && expertLanguagesLower.includes(key);
        });
        if (!matchesLanguage) return false;
      }
      
      // Apply experience filter
      const hasSelectedExperience = Object.values(experience).some(value => value);
      if (hasSelectedExperience) {
        if (experience.lessThan5 && expert.experience >= 5) {
          if (!experience.between5And10 && !experience.moreThan10) return false;
        }
        if (experience.between5And10 && (expert.experience < 5 || expert.experience > 10)) {
          if (!experience.lessThan5 && !experience.moreThan10) return false;
        }
        if (experience.moreThan10 && expert.experience <= 10) {
          if (!experience.lessThan5 && !experience.between5And10) return false;
        }
      }
      
      return true;
    });
  }, [searchTerm, priceRange, specialties, languages, experience]);

  return {
    filters: {
      searchTerm,
      setSearchTerm,
      priceRange,
      setPriceRange,
      specialties,
      setSpecialties,
      languages,
      setLanguages,
      experience,
      setExperience,
      showFilters,
      setShowFilters,
    },
    filterCount,
    filteredExperts,
    handleResetFilters,
  };
};
