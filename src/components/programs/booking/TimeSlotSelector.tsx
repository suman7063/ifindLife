
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  label?: string;
}

interface TimeSlotSelectorProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate: string;
  availableSlots?: TimeSlot[];
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  selectedDate,
  availableSlots
}) => {
  // Default time slots if none provided
  const defaultTimeSlots: TimeSlot[] = [
    { time: '09:00', available: true, label: '9:00 AM' },
    { time: '10:00', available: true, label: '10:00 AM' },
    { time: '11:00', available: true, label: '11:00 AM' },
    { time: '12:00', available: false, label: '12:00 PM' },
    { time: '14:00', available: true, label: '2:00 PM' },
    { time: '15:00', available: true, label: '3:00 PM' },
    { time: '16:00', available: true, label: '4:00 PM' },
    { time: '17:00', available: false, label: '5:00 PM' }
  ];

  const timeSlots = availableSlots || defaultTimeSlots;

  if (!selectedDate) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Select Time</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Please select a date first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Select Time</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={slot.time}
            variant={selectedTime === slot.time ? "default" : "outline"}
            className={`text-sm ${
              !slot.available 
                ? 'opacity-50 cursor-not-allowed' 
                : selectedTime === slot.time 
                  ? 'bg-ifind-teal hover:bg-ifind-teal/90' 
                  : ''
            }`}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
          >
            {slot.label || slot.time}
          </Button>
        ))}
      </div>
      
      {selectedTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            Selected time: {timeSlots.find(slot => slot.time === selectedTime)?.label || selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
