
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const PricingSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Session Price ($)</label>
      <Input 
        type="number"
        value={expert.price} 
        onChange={(e) => onChange('price', Number(e.target.value))}
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Wait Time</label>
      <Input 
        value={expert.waitTime} 
        onChange={(e) => onChange('waitTime', e.target.value)}
        placeholder="Available or wait time"
      />
    </div>
  </div>
);

export default PricingSection;
