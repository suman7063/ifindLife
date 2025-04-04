
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FilterPanelProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedSpecialties: string[];
  setSelectedSpecialties: (specialties: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  experienceLevel: string;
  setExperienceLevel: (level: string) => void;
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
  resetFilters,
}) => {
  const specialtiesOptions = [
    'Anxiety',
    'Depression',
    'Stress Management',
    'Relationship Issues',
    'Trauma',
    'Family Therapy',
    'Cognitive Behavioral Therapy',
    'Mindfulness',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'Mandarin',
    'Hindi',
    'French',
    'German',
  ];

  const handleSpecialtyChange = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const handleLanguageChange = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  return (
    <Card className="w-full md:w-1/4 md:min-w-[250px] bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range Filter */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Price Range</h3>
          <div className="space-y-2">
            <Slider
              value={[priceRange[0], priceRange[1]]}
              min={0}
              max={5000}
              step={100}
              onValueChange={(values) => setPriceRange([values[0], values[1]])}
              className="mt-6"
            />
            <div className="flex justify-between">
              <span className="text-sm">₹{priceRange[0]}</span>
              <span className="text-sm">₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
        
        {/* Specialties Filter */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Specialties</h3>
          <div className="grid grid-cols-1 gap-2">
            {specialtiesOptions.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty}`}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={() => handleSpecialtyChange(specialty)}
                />
                <Label htmlFor={`specialty-${specialty}`} className="text-sm">{specialty}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Language Filter */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Languages</h3>
          <div className="grid grid-cols-1 gap-2">
            {languageOptions.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={() => handleLanguageChange(language)}
                />
                <Label htmlFor={`language-${language}`} className="text-sm">{language}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience Level Filter */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Experience Level</h3>
          <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <Label htmlFor="any">Any Experience</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">1-4 Years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">5-10 Years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="experienced" id="experienced" />
              <Label htmlFor="experienced">10+ Years</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
