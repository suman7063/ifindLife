
import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyAvailabilityState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-md">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Availability Set</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        You haven't set your availability yet. Set your available time periods so clients can book appointments with you.
      </p>
      <Button onClick={() => navigate('/expert-dashboard/set-availability')}>
        Set Your Availability
      </Button>
    </div>
  );
};

export default EmptyAvailabilityState;
