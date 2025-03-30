
import React from 'react';
import TimeSlotPicker from './TimeSlotPicker';
import { format, getDay, parseISO, isWithinInterval } from 'date-fns';
import { TimeSlot } from '@/hooks/useAppointments';

interface AvailableTimeSlotsSectionProps {
  selectedDate: Date | undefined;
  availabilities: any[];
  existingAppointments: any[];
  selectedTimeSlot: {
    startTime: string;
    endTime: string;
    timeSlotId?: string;
  } | null;
  setSelectedTimeSlot: React.Dispatch<React.SetStateAction<{
    startTime: string;
    endTime: string;
    timeSlotId?: string;
  } | null>>;
}

const AvailableTimeSlotsSection: React.FC<AvailableTimeSlotsSectionProps> = ({
  selectedDate,
  availabilities,
  existingAppointments,
  selectedTimeSlot,
  setSelectedTimeSlot
}) => {
  // Extract available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = getDay(selectedDate);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Get all possible time slots for this date from availabilities
    const possibleSlots: TimeSlot[] = [];
    
    availabilities.forEach(availability => {
      const startDate = parseISO(availability.start_date);
      const endDate = parseISO(availability.end_date);
      
      if (isWithinInterval(selectedDate, { start: startDate, end: endDate })) {
        availability.time_slots?.forEach((slot: any) => {
          if (
            (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek) ||
            (availability.availability_type === 'date_range' && slot.specific_date === formattedDate)
          ) {
            possibleSlots.push(slot);
          }
        });
      }
    });
    
    // Filter out slots that are already booked
    return possibleSlots.filter(slot => {
      // Check against existing appointments
      return !existingAppointments.some(appointment => 
        appointment.appointment_date === formattedDate &&
        (
          (appointment.start_time <= slot.start_time && appointment.end_time > slot.start_time) ||
          (appointment.start_time < slot.end_time && appointment.end_time >= slot.end_time) ||
          (appointment.start_time >= slot.start_time && appointment.end_time <= slot.end_time)
        )
      );
    });
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">2. Select a Time Slot</h3>
      {availableTimeSlots.length > 0 ? (
        <TimeSlotPicker
          timeSlots={availableTimeSlots}
          selectedTimeSlot={selectedTimeSlot}
          onSelectTimeSlot={setSelectedTimeSlot}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          No available time slots for this date.
        </p>
      )}
    </div>
  );
};

export default AvailableTimeSlotsSection;
