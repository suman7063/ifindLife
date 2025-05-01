
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const SpecialtiesSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <>
    <div>
      <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
      <Input 
        value={expert.specialties.join(", ")} 
        onChange={(e) => onChange('specialties', e.target.value.split(",").map(s => s.trim()))}
        placeholder="Anxiety, Depression, CBT"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Languages (comma separated)</label>
      <Input 
        value={expert.languages?.join(", ") || ""} 
        onChange={(e) => onChange('languages', e.target.value.split(",").map(s => s.trim()))}
        placeholder="English, Hindi"
      />
    </div>
  </>
);

export default SpecialtiesSection;
