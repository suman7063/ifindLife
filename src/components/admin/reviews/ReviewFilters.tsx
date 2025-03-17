
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
}

interface ReviewFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedExpertId: string | null;
  setSelectedExpertId: (id: string) => void;
  experts: Expert[];
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedExpertId,
  setSelectedExpertId,
  experts
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user or review content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full md:w-64">
        <Select 
          onValueChange={(value) => setSelectedExpertId(value)} 
          value={selectedExpertId || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an expert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Experts</SelectItem>
            {experts.map(expert => (
              <SelectItem key={expert.id} value={expert.id}>
                {expert.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReviewFilters;
