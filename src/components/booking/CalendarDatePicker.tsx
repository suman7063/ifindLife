
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isAfter, isBefore, parseISO, isWithinInterval, isSameDay, getDay } from 'date-fns';

interface CalendarDatePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  availabilities: any[];
  existingAppointments: any[];
}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({ 
  selectedDate, 
  setSelectedDate,
  availabilities,
  existingAppointments
}) => {
  // Determine available dates for the calendar (based on expert availability)
  const getAvailableDates = () => {
    const today = new Date();
    
    return (date: Date) => {
      // Don't allow booking in the past
      if (isBefore(date, today) && !isSameDay(date, today)) {
        return true;
      }
      
      // Check if date is within any availability period
      for (const availability of availabilities) {
        const startDate = parseISO(availability.start_date);
        const endDate = parseISO(availability.end_date);
        
        if (isWithinInterval(date, { start: startDate, end: endDate })) {
          // For recurring availability, check day of week
          if (availability.availability_type === 'recurring') {
            const dayOfWeek = getDay(date); // 0 for Sunday, 1 for Monday, etc.
            
            // Check if this day of week has any time slots
            const hasDaySlots = availability.time_slots?.some(
              (slot: any) => slot.day_of_week === dayOfWeek
            );
            
            if (hasDaySlots) {
              return false; // Date is available
            }
          } else if (availability.availability_type === 'date_range') {
            // For date range availability, check if there are slots for this specific date
            const dateStr = date.toISOString().split('T')[0];
            const hasDaySlots = availability.time_slots?.some(
              (slot: any) => slot.specific_date === dateStr
            );
            
            if (hasDaySlots) {
              return false; // Date is available
            }
          }
        }
      }
      
      return true; // Date is unavailable
    };
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">1. Select a Date</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border rounded-md"
        disabled={getAvailableDates()}
      />
    </div>
  );
};

export default CalendarDatePicker;
