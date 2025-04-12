
import React from 'react';
import { ChevronDown, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProgramSortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const ProgramSortOptions: React.FC<ProgramSortOptionsProps> = ({ 
  sortOption, 
  setSortOption 
}) => {
  const getSortLabel = (option: string): string => {
    switch(option) {
      case 'popularity': return 'Most Popular';
      case 'newest': return 'Newest First';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Sort Programs';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex gap-1">
          <SortAsc className="h-4 w-4" />
          {getSortLabel(sortOption)}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setSortOption('popularity')}
          className={sortOption === 'popularity' ? 'bg-accent' : ''}
        >
          Most Popular
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortOption('newest')}
          className={sortOption === 'newest' ? 'bg-accent' : ''}
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortOption('price-low')}
          className={sortOption === 'price-low' ? 'bg-accent' : ''}
        >
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortOption('price-high')}
          className={sortOption === 'price-high' ? 'bg-accent' : ''}
        >
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProgramSortOptions;
