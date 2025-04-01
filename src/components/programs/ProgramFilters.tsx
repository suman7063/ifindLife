
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ProgramCategory } from '@/types/programs';

interface ProgramFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  categoryOptions: { value: ProgramCategory | 'all', label: string }[];
}

const ProgramFilters: React.FC<ProgramFiltersProps> = ({ 
  activeCategory, 
  setActiveCategory, 
  sortOption, 
  setSortOption,
  categoryOptions
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Sort by</h3>
          <Select
            value={sortOption}
            onValueChange={setSortOption}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort programs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <RadioGroup 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="space-y-3"
          >
            {categoryOptions.map(category => (
              <div key={category.value} className="flex items-center space-x-2">
                <RadioGroupItem value={category.value} id={`category-${category.value}`} />
                <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramFilters;
