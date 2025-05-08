
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, PhoneCall, Star, MessageCircle, Clock } from 'lucide-react';

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
  onBookClick: () => void;
  onChatClick: () => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ 
  expert, 
  onCallClick, 
  onBookClick, 
  onChatClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      {/* Expert Image and Online Status */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
            <img 
              src={expert.imageUrl} 
              alt={expert.name}
              className="w-full h-full object-cover" 
            />
          </div>
          
          {expert.online && (
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mt-3">{expert.name}</h2>
        
        <div className="flex items-center mt-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="ml-1 text-gray-800">{expert.rating}</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-gray-500">{expert.consultations.toLocaleString()} consultations</span>
        </div>
      </div>
      
      {/* Specialty Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {expert.specialties.map((specialty, index) => (
          <Badge key={index} variant="outline" className="bg-primary/10">
            {specialty}
          </Badge>
        ))}
      </div>
      
      {/* Languages */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {expert.languages.map((language, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/20">
              {language}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Pricing and Wait Time */}
      <div className="mb-6 p-3 bg-background rounded-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-sm">{expert.waitTime}</span>
          </div>
          <div className="font-semibold">₹{expert.price}/min</div>
        </div>
        <p className="text-xs text-muted-foreground">First 15 minutes free, then ₹{expert.price}/min</p>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={onCallClick}
          className="flex items-center justify-center"
          disabled={!expert.online}
        >
          <PhoneCall className="w-4 h-4 mr-2" />
          Call Now
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center justify-center"
          onClick={onBookClick}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book
        </Button>
        
        <Button 
          variant="outline" 
          className="col-span-2 flex items-center justify-center"
          onClick={onChatClick}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default ExpertProfile;
