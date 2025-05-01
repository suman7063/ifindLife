
import React from 'react';
import { Input } from "@/components/ui/input";
import { SectionProps } from '../types';

const ImageSection: React.FC<SectionProps> = ({ expert, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Profile Image URL</label>
    <Input 
      value={expert.imageUrl} 
      onChange={(e) => onChange('imageUrl', e.target.value)}
      placeholder="https://example.com/image.jpg"
    />
  </div>
);

export default ImageSection;
