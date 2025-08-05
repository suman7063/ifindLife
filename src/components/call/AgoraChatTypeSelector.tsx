
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
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Chat with {expert.name}</CardTitle>
        <CardDescription>
          Start a text conversation with {expert.name} for real-time guidance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pb-2">
        <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer">
          <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium text-lg">Text Chat</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Connect through text messaging for convenient communication
            </p>
            <p className="mt-4 font-medium">₹{chatPrice}/min</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              onClick={() => onSelectChatType('text')}
            >
              Start Chat Session
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex gap-2">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The first 15 minutes are free. After that, you'll be charged at ₹{chatPrice} per minute.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgoraChatTypeSelector;
