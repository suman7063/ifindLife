
import React from 'react';
import { Button } from '@/components/ui/button';
import TimeInput from './TimeInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlotSectionProps {
  availabilityType: 'date_range' | 'recurring';
  timeSlots: { startTime: string; endTime: string; dayOfWeek: number }[];
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onUpdateTimeSlot: (index: number, field: string, value: any) => void;
}

const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  availabilityType,
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Time Slots</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddTimeSlot}>
          Add Time Slot
        </Button>
      </div>
      
      {timeSlots.map((slot, index) => (
        <div key={index} className="flex flex-wrap gap-4 items-center p-3 border rounded-md">
          {availabilityType === 'recurring' && (
            <div className="w-full sm:w-auto">
              <h4 className="text-xs font-medium mb-1">Day of Week</h4>
              <Select
                value={slot.dayOfWeek?.toString()}
                onValueChange={(value) => onUpdateTimeSlot(index, 'dayOfWeek', parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <TimeInput
            label="Start Time"
            value={slot.startTime}
            onChange={(value) => onUpdateTimeSlot(index, 'startTime', value)}
          />
          
          <TimeInput
            label="End Time"
            value={slot.endTime}
            onChange={(value) => onUpdateTimeSlot(index, 'endTime', value)}
          />
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full self-end mb-1"
            onClick={() => onRemoveTimeSlot(index)}
            disabled={timeSlots.length === 1}
          >
            <span className="sr-only">Remove</span>
            <span>×</span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotSection;
