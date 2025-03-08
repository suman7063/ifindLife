
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, PhoneCall, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CallModal from './CallModal';
import { toast } from '@/hooks/use-toast';

interface AstrologerCardProps {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string;
  imageUrl: string;
  online?: boolean;
}

const AstrologerCard: React.FC<AstrologerCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  consultations,
  price,
  waitTime = 'Available',
  imageUrl,
  online = true
}) => {
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  const handleCallClick = () => {
    if (online && waitTime === 'Available') {
      setIsCallModalOpen(true);
    } else {
      toast({
        title: "Astrologer Unavailable",
        description: "This astrologer is currently offline or busy. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleChatClick = () => {
    navigate(`/astrologers/${id}`);
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group border border-border/50 hover:border-astro-light-purple/50">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {online && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white hover:bg-green-600">Online</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {experience} yrs exp
              </p>
            </div>
            <div className="flex items-center bg-astro-stardust px-2 py-1 rounded text-sm font-medium text-astro-deep-blue">
              <Star className="h-3.5 w-3.5 fill-astro-gold text-astro-gold mr-1" />
              {rating}
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="bg-muted/50">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className={waitTime === 'Available' ? 'text-green-600' : 'text-muted-foreground'}>
                {waitTime}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-astro-purple">₹{price}</span>
              <span className="text-muted-foreground">/min</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            {consultations.toLocaleString()}+ consultations
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white transition-all"
            onClick={handleCallClick}
          >
            <PhoneCall className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button 
            className="flex-1 bg-astro-purple hover:bg-astro-violet transition-colors"
            onClick={handleChatClick}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </CardFooter>
      </Card>
      
      <CallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        astrologer={{ id, name, imageUrl, price }}
      />
    </>
  );
};

export default AstrologerCard;
