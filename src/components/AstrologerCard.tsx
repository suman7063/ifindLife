import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { StarIcon, PhoneIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AstrologerCardProps {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  price: number;
  imageUrl: string;
  waitTime: string;
  online: boolean;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  price,
  imageUrl,
  waitTime,
  online
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
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer border bg-card"
      onClick={handleViewProfile}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={`${name}`} 
          className="w-full h-48 object-cover"
        />
        {online && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
            Online
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <StarIcon className="h-4 w-4 fill-current" />
            <span className="ml-1 text-foreground">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          {experience} years experience
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {specialties.slice(0, 3).map((specialty, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-secondary/10">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{specialties.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">{waitTime}</span>
          <span className="font-medium">₹{price}/min</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            className="w-full flex items-center justify-center"
            onClick={handleCallNow}
            disabled={!online}
          >
            <PhoneIcon className="h-3 w-3 mr-1" />
            Call Now
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="w-full flex items-center justify-center"
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

export default AstrologerCard;
