
import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export interface SearchSortProps {
  expertCount: number;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchSort: React.FC<SearchSortProps> = ({ expertCount, onToggleFilters, showFilters }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-muted-foreground">
        {expertCount} {expertCount === 1 ? 'expert' : 'experts'} found
      </p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleFilters}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </div>
  );
};

export default SearchSort;
