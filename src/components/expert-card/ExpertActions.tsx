import React from 'react';
import { MessageSquare, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpertActionsProps } from './types';

const ExpertActions: React.FC<ExpertActionsProps> = ({ expert, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(expert.id);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {/* View Profile Button (Primary action) */}
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleClick}
      >
        View Profile
      </Button>
      
      {/* Optional quick action buttons can be added here */}
      {/* For now, using a simpler implementation */}
    </div>
  );
};

export default ExpertActions;
