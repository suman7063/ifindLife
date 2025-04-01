
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ProgramCategory } from '@/types/programs';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';

interface MobileFilterSheetProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  activeCategory,
  setActiveCategory,
  sortOption,
  setSortOption,
  categoryOptions
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filters & Sort
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader>
          <SheetTitle>Filter & Sort Programs</SheetTitle>
          <SheetDescription>
            Narrow down programs based on your preferences
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 overflow-y-auto max-h-[calc(70vh-120px)]">
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
  );
};

export default MobileFilterSheet;
