
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Video } from 'lucide-react';

type ChatType = 'text' | 'video';

interface AgoraChatTypeSelectorProps {
  expert: {
    id: number;
    name: string;
    imageUrl?: string;
    price: number;
  };
  onSelectChatType: (type: ChatType) => void;
}

const AgoraChatTypeSelector: React.FC<AgoraChatTypeSelectorProps> = ({
  expert,
  onSelectChatType
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose chat type:</h3>
      
      <div className="flex flex-col md:flex-row gap-3">
        <Button 
          onClick={() => onSelectChatType('text')}
          className="flex items-center justify-center gap-2 py-6"
          variant="outline"
        >
          <MessageSquare className="h-5 w-5" />
          <div>
            <div className="font-medium">Text Chat</div>
            <div className="text-xs text-muted-foreground">₹{expert.price}/min</div>
          </div>
        </Button>
        
        <Button 
          onClick={() => onSelectChatType('video')}
          className="flex items-center justify-center gap-2 py-6"
          variant="outline"
        >
          <Video className="h-5 w-5" />
          <div>
            <div className="font-medium">Video Chat</div>
            <div className="text-xs text-muted-foreground">₹{expert.price}/min</div>
          </div>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4">
        You will be charged ₹{expert.price} per minute. Free session starts with 3 minutes.
      </p>
    </div>
  );
};

export default AgoraChatTypeSelector;
