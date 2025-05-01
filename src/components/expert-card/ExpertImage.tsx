
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ExpertImageProps {
  imageUrl: string;
  name: string;
  online: boolean;
}

const ExpertImage: React.FC<ExpertImageProps> = ({ imageUrl, name, online }) => (
  <div className="relative">
    <img 
      src={imageUrl} 
      alt={`${name}`} 
      className="w-full h-40 object-cover"
    />
    {online && (
      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
        Online
      </Badge>
    )}
  </div>
);

export default ExpertImage;
