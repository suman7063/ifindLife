
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface SortButtonProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOption, setSortOption }) => {
  const getDisplayText = () => {
    switch (sortOption) {
      case 'popularity': return 'Most Popular';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Newest First';
    }
  };

  const toggleSort = () => {
    setSortOption(sortOption === 'popularity' ? 'price-low' : 'popularity');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleSort}
      className="ml-auto hidden sm:inline-flex"
    >
      <ArrowUpDown className="h-4 w-4 mr-2" />
      {getDisplayText()}
    </Button>
  );
};

export default SortButton;
