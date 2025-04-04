import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal } from 'lucide-react';
import { ProgramCategory } from '@/types/programs';

interface MobileFilterSheetProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryOptions: { value: ProgramCategory | 'all' | 'favorites', label: string }[];
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onResetFilters: () => void;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  activeCategory,
  setActiveCategory,
  categoryOptions,
  sortOrder,
  setSortOrder,
  onResetFilters
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="sm:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="sm:hidden">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h4 className="mb-2 font-semibold">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(category => (
                <Button
                  key={category.value}
                  variant={activeCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="mb-2 font-semibold">Sort By</h4>
            <div className="grid gap-2">
              <Button
                variant={sortOrder === 'newest' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOrder('newest')}
              >
                Newest
              </Button>
              <Button
                variant={sortOrder === 'price-asc' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOrder('price-asc')}
              >
                Price: Low to High
              </Button>
              <Button
                variant={sortOrder === 'price-desc' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOrder('price-desc')}
              >
                Price: High to Low
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
