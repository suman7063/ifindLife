
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AvailabilityTypeSelectorProps {
  availabilityType: 'date_range' | 'recurring';
  onAvailabilityTypeChange: (value: 'date_range' | 'recurring') => void;
}

const AvailabilityTypeSelector: React.FC<AvailabilityTypeSelectorProps> = ({
  availabilityType,
  onAvailabilityTypeChange
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Availability Type</h3>
      <Select 
        value={availabilityType} 
        onValueChange={(value) => onAvailabilityTypeChange(value as 'date_range' | 'recurring')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select availability type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date_range">Specific Date Range</SelectItem>
          <SelectItem value="recurring">Recurring Weekly Schedule</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AvailabilityTypeSelector;
