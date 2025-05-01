
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from './types';

const BiographySection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <div>
    <label className="text-xs font-medium">Bio</label>
    <Textarea
      value={expert.bio || ""}
      onChange={(e) => updateExpert('bio', e.target.value)}
      rows={3}
    />
  </div>
);

export default BiographySection;
