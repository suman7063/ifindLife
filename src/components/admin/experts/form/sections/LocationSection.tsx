
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const LocationSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input 
          value={expert.address || ""} 
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="123 Main St"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <Input 
          value={expert.city || ""} 
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="New Delhi"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <Input 
          value={expert.state || ""} 
          onChange={(e) => onChange('state', e.target.value)}
          placeholder="Delhi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <Input 
          value={expert.country || ""} 
          onChange={(e) => onChange('country', e.target.value)}
          placeholder="India"
        />
      </div>
    </div>
  </>
);

export default LocationSection;
