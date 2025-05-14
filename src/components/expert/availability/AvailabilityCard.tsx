
import React from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface AvailabilityCardProps {
  availability: {
    id: string;
    start_date: string;
    end_date: string;
    availability_type: string;
    timeSlots?: {
      day_of_week?: number;
      specific_date?: string;
      start_time: string;
      end_time: string;
    }[];
  };
  onDelete: (id: string) => void;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ availability, onDelete }) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };
  
  const getAvailabilityTypeLabel = (type: string) => {
    switch(type) {
      case 'recurring':
        return 'Weekly Schedule';
      case 'specific':
        return 'Specific Dates';
      default:
        return 'Custom Schedule';
    }
  };
  
  const getDayName = (dayNum?: number) => {
    if (dayNum === undefined) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || '';
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>{getAvailabilityTypeLabel(availability.availability_type)}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Date Range:</h4>
          <p className="font-medium">
            {formatDate(availability.start_date)} – {formatDate(availability.end_date)}
          </p>
        </div>
        
        {availability.timeSlots && availability.timeSlots.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Available Times:</h4>
            <ul className="space-y-2">
              {availability.timeSlots.map((slot, idx) => (
                <li key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <div>
                    {slot.day_of_week !== undefined && (
                      <span className="font-medium">{getDayName(slot.day_of_week)}: </span>
                    )}
                    {slot.specific_date && (
                      <span className="font-medium">{formatDate(slot.specific_date)}: </span>
                    )}
                    <span>
                      {slot.start_time} to {slot.end_time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50">
        <Button 
          variant="ghost" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
          onClick={() => onDelete(availability.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvailabilityCard;
