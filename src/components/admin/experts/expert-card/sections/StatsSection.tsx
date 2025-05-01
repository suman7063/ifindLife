
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const StatsSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Experience (years)</label>
        <Input
          type="number"
          value={expert.experience}
          onChange={(e) => updateExpert('experience', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Rating</label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={expert.rating}
          onChange={(e) => updateExpert('rating', Number(e.target.value))}
        />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium">Consultations</label>
        <Input
          type="number"
          value={expert.consultations}
          onChange={(e) => updateExpert('consultations', Number(e.target.value))}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Price ($/min)</label>
        <Input
          type="number"
          value={expert.price}
          onChange={(e) => updateExpert('price', Number(e.target.value))}
        />
      </div>
    </div>
  </>
);

export default StatsSection;
