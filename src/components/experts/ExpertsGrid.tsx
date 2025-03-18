
import React from 'react';
import ExpertCard from '@/components/ExpertCard';
import { Expert } from '@/types/expert';

interface ExpertsGridProps {
  experts: Expert[];
  isLoading?: boolean;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ experts, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-5 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No experts found matching your criteria</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map(expert => (
        <ExpertCard key={expert.id} expert={expert} />
      ))}
    </div>
  );
};

export default ExpertsGrid;
