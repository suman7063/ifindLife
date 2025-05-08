
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { ExpertInfoProps } from './types';

const ExpertInfo: React.FC<ExpertInfoProps> = ({
  name,
  experience,
  specialties,
  rating,
  waitTime,
  price
}) => {
  return (
    <div className="space-y-3 mb-4">
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{experience} years experience</p>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center text-amber-500 mr-3">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm font-medium">{rating}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <span className={`h-2 w-2 rounded-full mr-1 ${waitTime === 'Available' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
          <span className="text-muted-foreground">{waitTime}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {specialties.slice(0, 3).map((specialty, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {specialty}
          </Badge>
        ))}
        {specialties.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{specialties.length - 3}
          </Badge>
        )}
      </div>
      
      <div className="font-semibold">
        ₹{price}/min
      </div>
    </div>
  );
};

export default ExpertInfo;
