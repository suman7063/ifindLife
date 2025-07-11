
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
    </div>
  );
};

export default SearchSort;
