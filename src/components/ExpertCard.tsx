
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { StarIcon, PhoneIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpertCardProps {
  id: string; // Changed to string
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  price: number;
  imageUrl: string;
  waitTime: string;
  online: boolean;
  consultations?: number;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  price,
  imageUrl,
  waitTime,
  online,
  consultations
}) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/experts/${id}`);
  };
  
  const handleCallNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/experts/${id}?call=true`);
  };
  
  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/experts/${id}?book=true`);
  };
  
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer border bg-card h-full"
      onClick={handleViewProfile}
    >
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
      
      <CardContent className="p-4">
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
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            className="w-full flex items-center justify-center text-xs"
            onClick={handleCallNow}
            disabled={!online}
          >
            <PhoneIcon className="h-3 w-3 mr-1" />
            Call Now
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="w-full flex items-center justify-center text-xs"
            onClick={handleBookAppointment}
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            Book
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
