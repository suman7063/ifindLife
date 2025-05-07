
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange, className }) => {
  // Generate hour options from 00 to 23
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i < 10 ? `0${i}` : `${i}`
  );
  
  // Generate minute options in 15-minute increments
  const minuteOptions = ['00', '15', '30', '45'];
  
  const [hour, minute] = value.split(':');
  
  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minute}`);
  };
  
  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour}:${newMinute}`);
  };
  
  return (
    <div className={className}>
      <Label className="text-xs font-medium mb-1">{label}</Label>
      <div className="flex items-center gap-2">
        <Select value={hour} onValueChange={handleHourChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map((h) => (
              <SelectItem key={`hour-${h}`} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-muted-foreground">:</span>
        
        <Select value={minute} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((m) => (
              <SelectItem key={`min-${m}`} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeInput;
