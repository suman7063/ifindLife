
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface ExpertAvailabilityProps {
  expertId: string;
  availableDates?: Date[];
}

const ExpertAvailability: React.FC<ExpertAvailabilityProps> = ({ 
  expertId, 
  availableDates = [] 
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  
  // This would typically come from an API call
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Availability</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className={cn("rounded-md border")}
        modifiers={{
          available: (date) => isDateAvailable(date),
        }}
        modifiersStyles={{
          available: { fontWeight: 'bold', textDecoration: 'underline' },
        }}
      />
      <div className="mt-4 text-sm text-gray-500">
        <p>Underlined dates indicate availability.</p>
        <p>Click on an available date to see time slots.</p>
      </div>
      
      {selectedDate && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">
            Time slots for {selectedDate.toLocaleDateString()}:
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {['9:00 AM', '10:00 AM', '2:00 PM'].map((slot) => (
              <div 
                key={slot} 
                className="text-center py-2 px-1 text-sm border rounded cursor-pointer hover:bg-gray-50"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertAvailability;
