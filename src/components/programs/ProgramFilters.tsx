
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Filter, ArrowUpAZ } from 'lucide-react';
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border shadow-sm">
      <div className="w-full sm:w-auto flex items-center">
        <span className="mr-2 text-sm font-medium">Category:</span>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto flex items-center">
        <span className="mr-2 text-sm font-medium">Sort by:</span>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
      
      <div className="w-full sm:w-auto flex sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter Programs</SheetTitle>
              <SheetDescription>
                Narrow down programs based on your preferences
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-4">
              <h3 className="font-medium mb-3">Categories</h3>
              <RadioGroup 
                value={activeCategory} 
                onValueChange={setActiveCategory}
                className="space-y-3"
              >
                {categoryOptions.map(category => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.value} id={`mobile-category-${category.value}`} />
                    <Label htmlFor={`mobile-category-${category.value}`}>{category.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-3">Sort by</h3>
              <RadioGroup 
                value={sortOption} 
                onValueChange={setSortOption}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="mobile-sort-newest" />
                  <Label htmlFor="mobile-sort-newest">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="mobile-sort-price-low" />
                  <Label htmlFor="mobile-sort-price-low">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="mobile-sort-price-high" />
                  <Label htmlFor="mobile-sort-price-high">Price: High to Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="popularity" id="mobile-sort-popularity" />
                  <Label htmlFor="mobile-sort-popularity">Most Popular</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end mt-4">
              <SheetClose asChild>
                <Button>Apply Filters</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProgramFilters;
