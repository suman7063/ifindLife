
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExpertActionsProps } from './types';

const ExpertActions: React.FC<ExpertActionsProps> = ({ expert, onClick }) => {
  return (
    <div className="mt-3 flex justify-end">
      <Button 
        onClick={onClick}
        className="bg-primary hover:bg-primary/90 text-white"
        size="sm"
      >
        View Profile
      </Button>
    </div>
  );
};

export default ExpertActions;
