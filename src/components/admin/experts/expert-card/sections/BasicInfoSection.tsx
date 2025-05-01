
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const BasicInfoSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <div>
    <label className="text-xs font-medium">Name</label>
    <Input
      value={expert.name}
      onChange={(e) => updateExpert('name', e.target.value)}
    />
  </div>
);

export default BasicInfoSection;
