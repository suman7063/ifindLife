
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Star } from 'lucide-react';
import { CardFooter, CardHeader } from '@/components/ui/card';
import { ExpertCardProps } from './types';

const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  experience = 0,
  specialties = [],
  rating = 0,
  consultations = 0,
  price = 0,
  waitTime = 'N/A',
  imageUrl = '',
  online = false,
  isFavorite = false,
  onFavoriteToggle,
  onCallNow,
  onBookAppointment
}) => {
  // Handle click events
  const handleFavoriteToggle = () => {
    if (onFavoriteToggle && id) {
      onFavoriteToggle(id);
    }
  };

  const handleCallNow = () => {
    if (onCallNow && id) {
      onCallNow(id);
    }
  };

  const handleBookAppointment = () => {
    if (onBookAppointment && id) {
      onBookAppointment(id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-ifind-teal text-white">
                {name ? name.substring(0, 2).toUpperCase() : 'EX'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
                <span className="mx-1">•</span>
                <span>{consultations} consultations</span>
              </div>
            </div>
          </div>
          {online && (
            <Badge variant="success" className="px-2 py-0.5 text-xs">
              Online
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 pt-1">
        <div className="mb-3 flex flex-wrap gap-1">
          {specialties.slice(0, 3).map((specialty, idx) => (
            <Badge key={idx} variant="outline" className="bg-gray-50">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{specialties.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Experience:</span> {experience} years
          </div>
          <div>
            <span className="text-muted-foreground">Wait time:</span> {waitTime}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 border-t bg-gray-50 p-3">
        <div className="font-semibold text-ifind-teal">
          ${price}/consultation
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={handleCallNow}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleBookAppointment}>
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
