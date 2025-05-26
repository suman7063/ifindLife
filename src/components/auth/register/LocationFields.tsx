
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationFieldsProps {
  country: string;
  city: string;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  disabled: boolean;
}

const LocationFields: React.FC<LocationFieldsProps> = ({
  country,
  city,
  onCountryChange,
  onCityChange,
  disabled
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">Country</label>
        <Select
          value={country}
          onValueChange={onCountryChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="UK">UK</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">City (Optional)</label>
        <Input
          id="city"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Enter your city"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default LocationFields;
