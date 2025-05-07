
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DurationOption, calculateEndDate } from './utils/availabilityUtils';

interface DateRangeSelectorProps {
  durationOption: DurationOption;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDurationChange: (value: DurationOption) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  durationOption,
  startDate,
  endDate,
  onDurationChange,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Duration</h3>
        <Select value={durationOption} onValueChange={(value) => onDurationChange(value as DurationOption)}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 Months</SelectItem>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="9">9 Months</SelectItem>
            <SelectItem value="12">12 Months</SelectItem>
            <SelectItem value="custom">Custom Date Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Start Date</h3>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            className="border rounded-md"
            disabled={(date) => date < new Date()}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">End Date</h3>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            className="border rounded-md"
            disabled={(date) => date < (startDate || new Date())}
          />
        </div>
      </div>
    </>
  );
};

export default DateRangeSelector;
