
import React from 'react';
import { Star, PhoneCall, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface ExpertProfileProps {
  expert: {
    id: number;
    name: string;
    experience: number;
    specialties: string[];
    rating: number;
    consultations: number;
    price: number;
    waitTime: string;
    imageUrl: string;
    online: boolean;
    languages: string[];
  };
  onCallClick: () => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert, onCallClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-astro-light-purple">
            <img 
              src={expert.imageUrl} 
              alt={expert.name} 
              className="h-full w-full object-cover"
            />
          </div>
          {expert.online && (
            <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        
        <h1 className="text-xl font-bold mb-1">{expert.name}</h1>
        
        <div className="flex items-center justify-center mb-2">
          <Star className="h-4 w-4 fill-astro-gold text-astro-gold mr-1" />
          <span className="font-medium">{expert.rating}</span>
          <span className="text-sm text-muted-foreground ml-1">
            ({expert.consultations.toLocaleString()}+ consultations)
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {expert.languages.map((language, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50">
              {language}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="font-medium">{expert.experience} Years</div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="font-medium">₹{expert.price}</div>
            <div className="text-sm text-muted-foreground">Per Minute</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className={expert.waitTime === "Available" ? "text-green-600" : "text-muted-foreground"}>
            {expert.waitTime}
          </span>
        </div>
        
        <div className="flex gap-4 w-full">
          <Button 
            onClick={onCallClick}
            variant="outline" 
            className="flex-1 border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button className="flex-1 bg-astro-purple hover:bg-astro-violet">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
