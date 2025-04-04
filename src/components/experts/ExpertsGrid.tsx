
import React from 'react';
import { Button } from '@/components/ui/button';
import ExpertCard from '@/components/ExpertCard';
import { ExtendedExpert } from '@/types/programs';

interface ExpertsGridProps {
  experts: ExtendedExpert[];
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
        <ExpertCard 
          key={expert.id} 
          id={typeof expert.id === 'string' ? parseInt(expert.id, 10) : expert.id}
          name={expert.name}
          experience={expert.experience || ''}
          specialties={expert.specialties || []}
          rating={expert.rating || 0}
          consultations={expert.consultations || 0}
          price={expert.price || 0}
          waitTime={expert.waitTime || ''}
          imageUrl={expert.imageUrl || expert.profilePicture || ''}
          online={expert.online || false}
        />
      ))}
    </div>
  );
};

export default ExpertsGrid;
