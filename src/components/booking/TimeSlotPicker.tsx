
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/types/appointments';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: {
    startTime: string;
    endTime: string;
    timeSlotId?: string;
  } | null;
  onSelectTimeSlot: (slot: { startTime: string; endTime: string; timeSlotId?: string; } | null) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  timeSlots, 
  selectedTimeSlot, 
  onSelectTimeSlot 
}) => {
  const handleSelect = (slot: TimeSlot) => {
    onSelectTimeSlot({
      startTime: slot.start_time,
      endTime: slot.end_time,
      timeSlotId: slot.id
    });
  };
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {timeSlots.map((slot, index) => (
        <Button
          key={index}
          variant={selectedTimeSlot?.startTime === slot.start_time && selectedTimeSlot?.endTime === slot.end_time ? 'default' : 'outline'}
          className="w-full text-xs p-2 h-auto"
          onClick={() => handleSelect(slot)}
        >
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
