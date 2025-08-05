
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
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-primary mb-2">Choose Chat Type</h3>
        <p className="text-muted-foreground">Select how you'd like to connect with {expert.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => onSelectChatType('text')}
          className="flex items-center justify-center gap-3 py-8 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30 hover:from-accent/20 hover:to-primary/20 hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl"
          variant="outline"
        >
          <MessageSquare className="h-6 w-6 text-accent" />
          <div className="text-left">
            <div className="font-semibold text-foreground">Text Chat</div>
            <div className="text-sm text-accent font-medium">₹{expert.price}/min</div>
          </div>
        </Button>
        
        <Button 
          onClick={() => onSelectChatType('video')}
          className="flex items-center justify-center gap-3 py-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 hover:from-primary/20 hover:to-secondary/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl"
          variant="outline"
        >
          <Video className="h-6 w-6 text-primary" />
          <div className="text-left">
            <div className="font-semibold text-foreground">Video Chat</div>
            <div className="text-sm text-primary font-medium">₹{expert.price}/min</div>
          </div>
        </Button>
      </div>
      
      <div className="text-center p-4 bg-gradient-to-r from-muted/50 to-accent/5 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-primary">Free 3-minute trial</span> • Then ₹{expert.price} per minute
        </p>
      </div>
    </div>
  );
};

export default AgoraChatTypeSelector;
