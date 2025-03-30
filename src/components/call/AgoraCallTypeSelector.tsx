
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Video } from 'lucide-react';

interface AgoraCallTypeSelectorProps {
  expert: {
    name: string;
    imageUrl: string;
    price: number;
  };
  onSelectCallType: (type: 'audio' | 'video') => void;
}

const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ expert, onSelectCallType }) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
        <img 
          src={expert.imageUrl} 
          alt={expert.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold">{expert.name}</h3>
        <p className="text-sm text-muted-foreground">₹{expert.price}/min after first 15 minutes</p>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={() => onSelectCallType('audio')}
          className="flex items-center space-x-2"
          variant="outline"
        >
          <Phone className="h-4 w-4" />
          <span>Audio Call</span>
        </Button>
        
        <Button 
          onClick={() => onSelectCallType('video')}
          className="flex items-center space-x-2"
        >
          <Video className="h-4 w-4" />
          <span>Video Call</span>
        </Button>
      </div>
    </div>
  );
};

export default AgoraCallTypeSelector;
