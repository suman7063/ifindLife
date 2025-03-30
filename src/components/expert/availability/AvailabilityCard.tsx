
import React from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash } from 'lucide-react';
import { Availability } from '@/types/appointments';

interface AvailabilityCardProps {
  availability: Availability;
  onDelete: (availabilityId: string) => Promise<void>;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ availability, onDelete }) => {
  const isAvailabilityActive = () => {
    const now = new Date();
    const endDate = parseISO(availability.end_date);
    return isAfter(endDate, now);
  };

  return (
    <Card className={isAvailabilityActive() ? '' : 'opacity-70'}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              {format(parseISO(availability.start_date), 'MMM d, yyyy')} - {format(parseISO(availability.end_date), 'MMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {availability.availability_type === 'recurring' ? 'Weekly Schedule' : 'Specific Dates'}
            </CardDescription>
          </div>
          <Badge variant={isAvailabilityActive() ? 'default' : 'outline'}>
            {isAvailabilityActive() ? 'Active' : 'Expired'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Clock className="h-4 w-4" /> 
          Time Slots
        </h4>
        
        <ul className="space-y-2">
          {availability.time_slots?.map((slot, index) => (
            <li key={index} className="text-sm border rounded-md p-2">
              {availability.availability_type === 'recurring' && slot.day_of_week !== undefined && (
                <div className="font-medium">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.day_of_week]}
                </div>
              )}
              <div className="text-muted-foreground">
                {slot.start_time} - {slot.end_time}
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(availability.id)}
            disabled={!isAvailabilityActive()}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCard;
