
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star } from 'lucide-react';

interface SearchSortProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchSort: React.FC<SearchSortProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <>
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search experts by name"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing results
        </p>
        <div className="flex items-center space-x-1">
          <p className="text-sm">Sort by:</p>
          <Button variant="ghost" size="sm" className="text-sm">
            Rating
            <Star className="ml-1 h-3 w-3 fill-ifind-aqua text-ifind-aqua" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default SearchSort;
