
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Trash2, Clock } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface AvailabilityCardProps {
  availability: any;
  onDelete: (id: string) => void;
}

// Helper function to get day name from day of week number
const getDayName = (dayOfWeek: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ availability, onDelete }) => {
  // Format date range
  const startDate = parseISO(availability.start_date);
  const endDate = parseISO(availability.end_date);
  
  // Format time slots
  const formatTimeSlots = () => {
    if (!availability.time_slots || availability.time_slots.length === 0) {
      return 'No specific time slots';
    }
    
    return availability.time_slots.map((slot: any, index: number) => {
      const dayText = availability.availability_type === 'recurring' && slot.day_of_week !== undefined
        ? `${getDayName(slot.day_of_week)}: `
        : '';
        
      return (
        <div key={index} className="flex items-center gap-2 text-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>
            {dayText}{slot.start_time} - {slot.end_time}
          </span>
        </div>
      );
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {availability.availability_type === 'recurring' 
                ? 'Recurring Schedule' 
                : 'Date Range Availability'}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </p>
            
            <div className="space-y-1 mt-3">
              {formatTimeSlots()}
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Availability</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this availability? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => onDelete(availability.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCard;
