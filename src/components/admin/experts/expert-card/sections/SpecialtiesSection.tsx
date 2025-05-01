
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const SpecialtiesSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <>
    <div>
      <label className="text-xs font-medium">Specialties (comma separated)</label>
      <Input
        value={expert.specialties.join(", ")}
        onChange={(e) => updateExpert('specialties', e.target.value.split(",").map(s => s.trim()))}
      />
    </div>
    
    <div>
      <label className="text-xs font-medium">Languages (comma separated)</label>
      <Input
        value={expert.languages?.join(", ") || ""}
        onChange={(e) => updateExpert('languages', e.target.value.split(",").map(s => s.trim()))}
      />
    </div>
  </>
);

export default SpecialtiesSection;
