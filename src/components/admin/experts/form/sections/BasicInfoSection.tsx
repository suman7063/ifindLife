
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const BasicInfoSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <Input 
        value={expert.name} 
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Expert name"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Experience (years)</label>
        <Input 
          type="number"
          value={expert.experience} 
          onChange={(e) => onChange('experience', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <Input 
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={expert.rating} 
          onChange={(e) => onChange('rating', Number(e.target.value))}
        />
      </div>
    </div>
  </>
);

export default BasicInfoSection;
