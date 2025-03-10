
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  specialties: Record<string, boolean>;
  setSpecialties: (value: Record<string, boolean>) => void;
  languages: Record<string, boolean>;
  setLanguages: (value: Record<string, boolean>) => void;
  experience: Record<string, boolean>;
  setExperience: (value: Record<string, boolean>) => void;
  filterCount: number;
  onResetFilters: () => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  setPriceRange,
  specialties,
  setSpecialties,
  languages,
  setLanguages,
  experience,
  setExperience,
  filterCount,
  onResetFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {filterCount > 0 && (
              <Badge className="ml-2 bg-ifind-aqua">{filterCount}</Badge>
            )}
          </div>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Filter Panel Content */}
      <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            {filterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm h-auto py-1 px-2 hover:text-ifind-aqua"
                onClick={onResetFilters}
              >
                Reset All
              </Button>
            )}
          </div>
          
          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Price Range (₹/min)</h4>
            <div className="mb-4">
              <Slider 
                defaultValue={[0, 100]} 
                max={100} 
                step={1} 
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-2"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
          
          {/* Specialties Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Specialties</h4>
            <div className="space-y-2">
              {Object.entries(specialties).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`specialty-${key}`} 
                    checked={value}
                    onCheckedChange={(checked) => 
                      setSpecialties({...specialties, [key]: !!checked})
                    }
                    className="data-[state=checked]:bg-ifind-aqua data-[state=checked]:border-ifind-aqua"
                  />
                  <label 
                    htmlFor={`specialty-${key}`}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {key === 'selfEsteem' ? 'Self-Esteem' : key}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Language Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Languages</h4>
            <div className="space-y-2">
              {Object.entries(languages).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`language-${key}`} 
                    checked={value}
                    onCheckedChange={(checked) => 
                      setLanguages({...languages, [key]: !!checked})
                    }
                    className="data-[state=checked]:bg-ifind-aqua data-[state=checked]:border-ifind-aqua"
                  />
                  <label 
                    htmlFor={`language-${key}`}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Experience Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Experience</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exp-less-than-5" 
                  checked={experience.lessThan5}
                  onCheckedChange={(checked) => 
                    setExperience({...experience, lessThan5: !!checked})
                  }
                  className="data-[state=checked]:bg-ifind-aqua data-[state=checked]:border-ifind-aqua"
                />
                <label 
                  htmlFor="exp-less-than-5"
                  className="text-sm font-medium cursor-pointer"
                >
                  Less than 5 years
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exp-5-to-10" 
                  checked={experience.between5And10}
                  onCheckedChange={(checked) => 
                    setExperience({...experience, between5And10: !!checked})
                  }
                  className="data-[state=checked]:bg-ifind-aqua data-[state=checked]:border-ifind-aqua"
                />
                <label 
                  htmlFor="exp-5-to-10"
                  className="text-sm font-medium cursor-pointer"
                >
                  5-10 years
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exp-more-than-10" 
                  checked={experience.moreThan10}
                  onCheckedChange={(checked) => 
                    setExperience({...experience, moreThan10: !!checked})
                  }
                  className="data-[state=checked]:bg-ifind-aqua data-[state=checked]:border-ifind-aqua"
                />
                <label 
                  htmlFor="exp-more-than-10"
                  className="text-sm font-medium cursor-pointer"
                >
                  More than 10 years
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
