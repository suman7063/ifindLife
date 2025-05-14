
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyAvailabilityStateProps {
  onSetAvailability?: () => void;
}

const EmptyAvailabilityState: React.FC<EmptyAvailabilityStateProps> = ({ onSetAvailability }) => {
  return (
    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">No Availability Set</h3>
      <p className="text-gray-500 mb-6">
        You haven't added any availability schedule yet.
        <br />
        Set your available times to start accepting bookings.
      </p>
      {onSetAvailability && (
        <Button onClick={onSetAvailability} variant="default">
          Set Your Availability
        </Button>
      )}
    </div>
  );
};

export default EmptyAvailabilityState;
