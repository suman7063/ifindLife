
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare } from 'lucide-react';
import { ExpertActionsProps } from './types';

const ExpertActions: React.FC<ExpertActionsProps> = ({ expert, onClick }) => {
  // Prevent event bubbling when clicking action buttons
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };
  
  return (
    <div className="flex justify-end gap-2 mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={(e) => handleActionClick(e, () => {
          // Handle message action
          console.log('Message expert:', expert.name);
        })}
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        <span>Chat</span>
      </Button>
      
      <Button 
        size="sm" 
        className="rounded-full"
        onClick={(e) => handleActionClick(e, () => {
          // Handle call action
          console.log('Call expert:', expert.name);
        })}
      >
        <Phone className="h-4 w-4 mr-1" />
        <span>Call</span>
      </Button>
    </div>
  );
};

export default ExpertActions;
