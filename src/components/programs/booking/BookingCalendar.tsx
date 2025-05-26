
import React from 'react';
import { Calendar } from '@/components/ui/calendar';

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
    <div className="w-full">
      <Calendar
        mode="single"
        selected={selectedDateObj}
        onSelect={handleDateSelect}
        disabled={(date) => !isDateAvailable(date) || date < minDate || (maxDate && date > maxDate)}
        initialFocus
        className="w-full"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
          month: "space-y-2",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-7 font-normal text-xs",
          row: "flex w-full mt-1",
          cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
          day_selected: "bg-ifind-teal text-white hover:bg-ifind-teal hover:text-white focus:bg-ifind-teal focus:text-white",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
        }}
      />
      
      {selectedDate && (
        <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
          <p className="text-xs text-green-700">
            Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
