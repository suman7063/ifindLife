
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';

interface ExpertInfoProps {
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  waitTime: string;
  price: number;
}

const ExpertInfo: React.FC<ExpertInfoProps> = ({
  name,
  experience,
  specialties,
  rating,
  waitTime,
  price
}) => (
  <>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-base font-semibold">{name}</h3>
      <div className="flex items-center text-yellow-500">
        <StarIcon className="h-3.5 w-3.5 fill-current" />
        <span className="ml-1 text-sm text-foreground">{rating}</span>
      </div>
    </div>
    
    <p className="text-xs text-muted-foreground mb-2">
      {experience} years experience
    </p>
    
    <div className="flex flex-wrap gap-1 mb-3">
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
    
    <div className="flex justify-between items-center mb-3">
      <span className="text-xs text-muted-foreground">{waitTime}</span>
      <span className="font-medium text-sm">₹{price}/min</span>
    </div>
  </>
);

export default ExpertInfo;
