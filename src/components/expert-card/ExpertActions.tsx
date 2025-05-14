
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExpertActionsProps } from './types';

const ExpertActions: React.FC<ExpertActionsProps> = ({ expert, onClick }) => {
  return (
    <div className="mt-3">
      {expert.price && (
        <div className="mb-2">
          <span className="font-medium">₹{expert.price}</span>
          {expert.waitTime && (
            <span className="text-xs text-green-600 ml-2">{expert.waitTime}</span>
          )}
        </div>
      )}
      
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        size="sm"
        className="w-full"
      >
        View Profile
      </Button>
    </div>
  );
};

export default ExpertActions;
