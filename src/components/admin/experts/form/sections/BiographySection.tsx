
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from '../types';

const BiographySection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Bio</label>
    <Textarea 
      value={expert.bio || ""} 
      onChange={(e) => onChange('bio', e.target.value)}
      placeholder="Professional background and expertise"
      rows={3}
    />
  </div>
);

export default BiographySection;
