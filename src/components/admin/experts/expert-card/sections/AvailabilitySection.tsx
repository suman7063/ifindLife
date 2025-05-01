
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const AvailabilitySection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <div>
    <label className="text-xs font-medium">Wait Time</label>
    <Input
      value={expert.waitTime}
      onChange={(e) => updateExpert('waitTime', e.target.value)}
    />
  </div>
);

export default AvailabilitySection;
