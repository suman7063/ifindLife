
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  rating,
  text,
  date,
  imageUrl
}) => {
  return (
    <Card className="h-full border border-border/50 hover:border-astro-light-purple/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'fill-astro-gold text-astro-gold' : 'text-muted stroke-muted-foreground'}`} 
            />
          ))}
        </div>
        <p className="italic text-sm mb-4">"{text}"</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{location} • {date}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
