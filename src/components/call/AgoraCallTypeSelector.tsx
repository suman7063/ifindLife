
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Phone } from 'lucide-react';

interface AgoraCallTypeSelectorProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  onSelectCallType: (type: 'audio' | 'video') => void;
}

const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ expert, onSelectCallType }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Choose Call Type</CardTitle>
        <CardDescription>
          Select how you'd like to connect with {expert.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-lg">Video Call</h3>
              <p className="text-sm text-muted-foreground mt-2">
                See and hear the expert with both video and audio enabled
              </p>
              <p className="mt-4 font-medium">₹{expert.price}/min</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full" 
                onClick={() => onSelectCallType('video')}
              >
                Start Video Call
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-lg">Audio Call</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Connect with audio only for a more focused conversation
              </p>
              <p className="mt-4 font-medium">₹{expert.price}/min</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => onSelectCallType('audio')}
              >
                Start Audio Call
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex gap-2">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The first 15 minutes are free. After that, you'll be charged at ₹{expert.price} per minute.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgoraCallTypeSelector;
