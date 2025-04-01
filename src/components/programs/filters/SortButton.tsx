
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface SortButtonProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOption, setSortOption }) => {
  const getNextSortOption = () => {
    switch (sortOption) {
      case 'newest': return 'popularity';
      case 'popularity': return 'price-low';
      case 'price-low': return 'price-high';
      case 'price-high': return 'newest';
      default: return 'newest';
    }
  };

  const getDisplayText = () => {
    switch (sortOption) {
      case 'newest': return 'Newest First';
      case 'popularity': return 'Most Popular';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Sort By';
    }
  };

  const handleSort = () => {
    setSortOption(getNextSortOption());
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSort}
      className="ml-auto hidden sm:inline-flex"
    >
      <ArrowUpDown className="h-4 w-4 mr-2" />
      {getDisplayText()}
    </Button>
  );
};

export default SortButton;
