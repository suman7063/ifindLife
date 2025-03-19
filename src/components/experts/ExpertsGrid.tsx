
import React from 'react';
import { Button } from '@/components/ui/button';
import AstrologerCard from '@/components/AstrologerCard';
import { Expert } from '@/types/expert';

interface ExpertsGridProps {
  experts: Expert[];
  onResetFilters: () => void;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ experts, onResetFilters }) => {
  if (experts.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-lg font-medium mb-2">No experts found</p>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
        <Button 
          variant="outline" 
          className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => (
        <AstrologerCard 
          key={expert.id} 
          id={expert.id}
          name={expert.name}
          experience={expert.experience}
          specialties={expert.specialties}
          rating={expert.rating}
          consultations={expert.consultations}
          price={expert.price}
          waitTime={expert.waitTime}
          imageUrl={expert.imageUrl}
          online={expert.online}
        />
      ))}
    </div>
  );
};

export default ExpertsGrid;
