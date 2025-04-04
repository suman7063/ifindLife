
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ExperienceLevel } from '@/types/experts';

interface FilterPanelProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSpecialties: string[];
  setSelectedSpecialties: (specialties: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  resetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  setPriceRange,
  selectedSpecialties,
  setSelectedSpecialties,
  selectedLanguages,
  setSelectedLanguages,
  experienceLevel,
  setExperienceLevel,
  resetFilters
}) => {
  // Handler for toggling specialties
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  // Handler for toggling languages
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  // Handler for setting experience level
  const handleExperienceLevelChange = (level: string) => {
    setExperienceLevel(level as ExperienceLevel);
  };

  return (
    <div className="w-full md:w-1/4 md:min-w-[250px] bg-white p-4 rounded-lg border h-fit">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Price Range</h4>
        <Slider
          defaultValue={priceRange}
          min={0}
          max={5000}
          step={100}
          onValueChange={(values) => setPriceRange(values as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
      
      {/* Specialties */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Specialties</h4>
        <div className="space-y-2">
          {['Anxiety', 'Depression', 'Stress', 'Relationships', 'Career'].map(specialty => (
            <div key={specialty} className="flex items-center">
              <Checkbox 
                id={`specialty-${specialty}`}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => toggleSpecialty(specialty)}
              />
              <Label htmlFor={`specialty-${specialty}`} className="ml-2 text-sm cursor-pointer">
                {specialty}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Languages */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Languages</h4>
        <div className="space-y-2">
          {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(language => (
            <div key={language} className="flex items-center">
              <Checkbox 
                id={`language-${language}`} 
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => toggleLanguage(language)}
              />
              <Label htmlFor={`language-${language}`} className="ml-2 text-sm cursor-pointer">
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Experience Level</h4>
        <div className="space-y-2">
          {['Any', 'Beginner', 'Intermediate', 'Expert'].map(level => (
            <div key={level} className="flex items-center">
              <Checkbox 
                id={`level-${level}`} 
                checked={experienceLevel === level as ExperienceLevel}
                onCheckedChange={() => handleExperienceLevelChange(level as ExperienceLevel)}
              />
              <Label htmlFor={`level-${level}`} className="ml-2 text-sm cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reset Filters Button */}
      <Button 
        onClick={resetFilters}
        variant="outline" 
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterPanel;
