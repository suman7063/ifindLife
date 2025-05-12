
import React from 'react';
import { Expert } from '@/types/expert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ExpertCard from '@/components/expert-card';
import { useNavigate } from 'react-router-dom';

interface ExpertsGridProps {
  experts: Expert[];
  onResetFilters: () => void;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ experts, onResetFilters }) => {
  const navigate = useNavigate();
  
  if (!experts.length) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-700">No experts found</h3>
        <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters to find more experts</p>
        <Button onClick={onResetFilters}>Reset Filters</Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => {
        // Get specialties from specialization field or default to empty array
        const specialties = expert.specialization ? [expert.specialization] : [];
        
        // Get price from pricing if it exists, otherwise use default
        const price = expert.pricing?.price_per_min || 30;
        
        // Format experience to be a number (if string) or use default
        const experience = typeof expert.experience === 'string' 
          ? parseInt(expert.experience, 10) || 0 
          : expert.experience || 0;
        
        // Determine online status
        const isOnline = expert.verified || false;
        
        return (
          <ExpertCard
            key={expert.id}
            id={expert.id}
            name={expert.name}
            experience={experience}
            specialties={specialties}
            rating={expert.average_rating || 0}
            price={price}
            waitTime={isOnline ? "Available" : "Offline"}
            imageUrl={expert.profile_picture || '/placeholder.svg'}
            online={isOnline}
          />
        );
      })}
    </div>
  );
};

export default ExpertsGrid;
