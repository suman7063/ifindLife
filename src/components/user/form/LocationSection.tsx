
import React from 'react';
import { Building, MapPin } from 'lucide-react';
import ProfileFormField from './ProfileFormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// List of common countries
const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
  'Brazil',
  // Add more as needed
];

interface LocationSectionProps {
  formData: {
    country: string;
    city: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryChange: (value: string) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  handleChange,
  handleCountryChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select
          value={formData.country}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger id="country" className="w-full">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select country" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <ProfileFormField
        id="city"
        name="city"
        label="City (Optional)"
        value={formData.city || ''}
        onChange={handleChange}
        Icon={Building}
      />
    </div>
  );
};

export default LocationSection;
