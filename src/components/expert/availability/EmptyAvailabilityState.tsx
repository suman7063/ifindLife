
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAvailabilityState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-12 flex flex-col items-center text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Availability Set</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          You haven't set any availability periods yet. Define when you're available for appointments to start receiving bookings.
        </p>
        <Button onClick={() => navigate('/expert-dashboard')}>
          Set Your Availability
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAvailabilityState;
