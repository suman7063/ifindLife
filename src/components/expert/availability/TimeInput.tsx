
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '15', '30', '45'];
  
  const selectedHour = parseInt(value.split(':')[0]);
  const selectedMinute = value.split(':')[1];
  
  const handleHourChange = (hour: string) => {
    onChange(`${hour.padStart(2, '0')}:${selectedMinute}`);
  };
  
  const handleMinuteChange = (minute: string) => {
    onChange(`${selectedHour.toString().padStart(2, '0')}:${minute}`);
  };
  
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium">{label}</label>
      <div className="flex items-center gap-1">
        <Select value={selectedHour.toString()} onValueChange={handleHourChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span>:</span>
        
        <Select value={selectedMinute} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
