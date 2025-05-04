
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
  price,
}) => {
  return (
    <div className="space-y-2 mb-3">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{name}</h3>
        <div className="flex items-center text-yellow-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="ml-1 text-sm text-foreground">{rating?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        {experience} years experience
      </p>
      
      <div className="flex flex-wrap gap-1">
        {specialties.slice(0, 2).map((specialty, i) => (
          <Badge key={i} variant="outline" className="text-xs bg-secondary/10">
            {specialty}
          </Badge>
        ))}
        {specialties.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{specialties.length - 2}
          </Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{waitTime || 'Available'}</span>
        <span className="font-medium text-sm">₹{price}/min</span>
      </div>
    </div>
  );
};

export default ExpertInfo;
