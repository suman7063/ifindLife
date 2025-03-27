
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationInfoSectionProps {
  formData: {
    address: string;
    city: string;
    state: string;
    country: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationInfoSection: React.FC<LocationInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="address"
            name="address"
            type="text"
            className="pl-10"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );
};

export default LocationInfoSection;
