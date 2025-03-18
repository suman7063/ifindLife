
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, PhoneCall, Video, Award, Heart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CallModal from './CallModal';
import { toast } from '@/hooks/use-toast';
import { useDoxyme } from '@/hooks/auth/useDoxyme';
import { useUserAuth } from '@/hooks/useUserAuth';

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
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const { currentUser } = useUserAuth();
  const { startProviderSession, joinDoxymeRoom, isLoading } = useDoxyme();
  
  const handleCallClick = () => {
    if (online && waitTime === 'Available') {
      setIsCallModalOpen(true);
    } else {
      toast({
        title: "Expert Unavailable",
        description: "This expert is currently offline or busy. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleVideoCallClick = () => {
    if (online && waitTime === 'Available') {
      setIsVideoCallModalOpen(true);
    } else {
      toast({
        title: "Expert Unavailable",
        description: "This expert is currently offline or busy. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleDirectDoxymeCall = () => {
    if (!online || waitTime !== 'Available') {
      toast({
        title: "Expert Unavailable",
        description: "This expert is currently offline or busy. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to start a video session",
        variant: "destructive"
      });
      return;
    }
    
    const room = startProviderSession(currentUser, id.toString(), name);
    if (room) {
      joinDoxymeRoom(room.roomUrl);
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group border border-border/50 hover:border-ifind-teal/50">
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
              <Badge className="bg-ifind-teal text-white hover:bg-ifind-teal/80">Online</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-poppins font-semibold text-xl">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {experience} yrs exp
              </p>
            </div>
            <div className="flex items-center bg-ifind-aqua/10 px-2 py-1 rounded text-sm font-medium text-ifind-charcoal">
              <Star className="h-3.5 w-3.5 fill-ifind-aqua text-ifind-aqua mr-1" />
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
              <span className={waitTime === 'Available' ? 'text-ifind-teal' : 'text-muted-foreground'}>
                {waitTime}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-ifind-purple">₹{price}</span>
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
            className="flex-1 border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white transition-all"
            onClick={handleCallClick}
          >
            <PhoneCall className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button 
            className="flex-1 bg-ifind-purple hover:bg-ifind-purple/80 transition-colors"
            onClick={handleVideoCallClick}
          >
            <Video className="h-4 w-4 mr-1" />
            Video
          </Button>
        </CardFooter>
        <CardFooter className="pt-0 pb-3 px-4 border-t-0">
          <Button 
            variant="outline" 
            className="w-full border-ifind-teal text-ifind-teal hover:bg-ifind-teal/10"
            onClick={handleDirectDoxymeCall}
            disabled={isLoading}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {isLoading ? 'Loading...' : 'Doxy.me Session'}
          </Button>
        </CardFooter>
      </Card>
      
      <CallModal 
        isOpen={isCallModalOpen || isVideoCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setIsVideoCallModalOpen(false);
        }}
        astrologer={{ id, name, imageUrl, price }}
      />
    </>
  );
};

export default AstrologerCard;
