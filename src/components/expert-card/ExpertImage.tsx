
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpertImageProps } from './types';

const ExpertImage: React.FC<ExpertImageProps> = ({ imageUrl, name, online }) => {
  return (
    <div className="relative">
      <div className="aspect-[3/2] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {online && (
        <Badge className="absolute top-2 left-2 bg-green-500 text-white border-0">
          Online
        </Badge>
      )}
    </div>
  );
};

export default ExpertImage;
