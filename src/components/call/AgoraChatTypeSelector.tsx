
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface AgoraChatTypeSelectorProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  onSelectChatType: (type: 'text' | 'video') => void;
}

const AgoraChatTypeSelector: React.FC<AgoraChatTypeSelectorProps> = ({ expert, onSelectChatType }) => {
  // Chat has a discounted price compared to calls
  const chatPrice = Math.round(expert.price * 0.7); // 30% discount for chat
  
  return (
    <div className="bg-gradient-to-br from-background via-primary/5 to-accent/5 rounded-xl border border-primary/20 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Chat with {expert.name}
        </h2>
        <p className="text-muted-foreground">
          Start a text conversation with {expert.name} for real-time guidance
        </p>
      </div>
      
      <div className="space-y-6">
        <Card className="border-2 border-primary/30 hover:border-primary/60 hover:shadow-[var(--glow-primary)] transition-all duration-300 cursor-pointer bg-gradient-to-br from-background to-primary/5">
          <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 shadow-[var(--glow-accent)]">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Text Chat</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Connect through text messaging for convenient communication
            </p>
            <p className="mt-4 font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ₹{chatPrice}/min
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-300" 
              onClick={() => onSelectChatType('text')}
            >
              Start Chat Session
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-xl border border-accent/20">
          <p className="text-sm text-foreground">
            💫 The first 15 minutes are free. After that, you'll be charged at ₹{chatPrice} per minute.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgoraChatTypeSelector;
