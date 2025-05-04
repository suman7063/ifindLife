
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExpertImageProps } from './types';

const ExpertImage: React.FC<ExpertImageProps> = ({ imageUrl, name, online }) => {
  return (
    <div className="relative">
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {online && (
        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
          Online
        </Badge>
      )}
    </div>
  );
};

export default ExpertImage;
