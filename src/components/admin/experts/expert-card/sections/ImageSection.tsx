
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from './types';

const ImageSection: React.FC<SectionProps> = ({ expert, updateExpert }) => (
  <div className="w-full md:w-1/4">
    <img 
      src={expert.imageUrl} 
      alt={expert.name}
      className="aspect-square w-full object-cover rounded-lg" 
    />
    <Input
      className="mt-2 text-xs"
      placeholder="Image URL"
      value={expert.imageUrl}
      onChange={(e) => updateExpert('imageUrl', e.target.value)}
    />
  </div>
);

export default ImageSection;
