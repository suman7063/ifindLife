
import React from 'react';
import TimeSlotPicker from './TimeSlotPicker';
import { getAvailableTimeSlots } from '@/utils/bookingValidation';
import { TimeSlot } from '@/types/appointments';
import { AlertCircle } from 'lucide-react';

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
  // Get available time slots using our utility function
  const availableTimeSlots = selectedDate 
    ? getAvailableTimeSlots(selectedDate, availabilities, existingAppointments)
    : [];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">2. Select a Time Slot</h3>
      
      {selectedDate && (
        availableTimeSlots.length > 0 ? (
          <TimeSlotPicker
            timeSlots={availableTimeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
          />
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-400">
              No available time slots for this date. Please select a different date or check back later.
            </p>
          </div>
        )
      )}
      
      {!selectedDate && (
        <p className="text-sm text-muted-foreground">
          Please select a date first.
        </p>
      )}
    </div>
  );
};

export default AvailableTimeSlotsSection;
