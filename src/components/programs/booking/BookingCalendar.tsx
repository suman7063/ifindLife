
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates?: string[];
  minDate?: Date;
  maxDate?: Date;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  minDate = new Date(),
  maxDate
}) => {
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  // Generate next 30 days as available dates if none provided
  const defaultAvailableDates = React.useMemo(() => {
    if (availableDates.length > 0) return availableDates;
    
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for default availability
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  }, [availableDates]);

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return defaultAvailableDates.includes(dateString);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      onDateSelect(date.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Select Date</h3>
        <div className="border rounded-lg p-3">
          <Calendar
            mode="single"
            selected={selectedDateObj}
            onSelect={handleDateSelect}
            disabled={(date) => !isDateAvailable(date) || date < minDate || (maxDate && date > maxDate)}
            initialFocus
            className="w-full"
          />
        </div>
      </div>
      
      {selectedDate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">
            Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
