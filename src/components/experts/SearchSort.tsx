
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export interface SearchSortProps {
  expertCount: number;
  onToggleFilters: () => void;
  showFilters: boolean;
  onSortChange?: (sortBy: string) => void;
}

const SearchSort: React.FC<SearchSortProps> = ({ expertCount, onToggleFilters, showFilters, onSortChange }) => {
  const [sortBy, setSortBy] = useState('rating');

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-muted-foreground">
        {expertCount} {expertCount === 1 ? 'expert' : 'experts'} found
      </p>
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchSort;
