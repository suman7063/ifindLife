
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExpertActionProps } from './types';

const ExpertActions: React.FC<ExpertActionProps> = ({ id, online }) => {
  const navigate = useNavigate();
  
  const handleCallNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/experts/${id}?call=true`);
  };
  
  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/experts/${id}?book=true`);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button 
        size="sm" 
        className="w-full flex items-center justify-center text-xs"
        onClick={handleCallNow}
        disabled={!online}
      >
        <PhoneIcon className="h-3 w-3 mr-1" />
        Call Now
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        className="w-full flex items-center justify-center text-xs"
        onClick={handleBookAppointment}
      >
        <CalendarIcon className="h-3 w-3 mr-1" />
        Book
      </Button>
    </div>
  );
};

export default ExpertActions;
