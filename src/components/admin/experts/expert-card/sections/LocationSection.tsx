
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const LocationSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Address</label>
        <Input
          value={expert.address || ""}
          onChange={(e) => updateExpert('address', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium">City</label>
        <Input
          value={expert.city || ""}
          onChange={(e) => updateExpert('city', e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">State</label>
        <Input
          value={expert.state || ""}
          onChange={(e) => updateExpert('state', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Country</label>
        <Input
          value={expert.country || ""}
          onChange={(e) => updateExpert('country', e.target.value)}
        />
      </div>
    </div>
  </>
);

export default LocationSection;
