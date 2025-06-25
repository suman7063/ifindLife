
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Phone } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface AgoraCallTypeSelectorProps {
  callType?: 'voice' | 'video';
  onCallTypeChange?: (type: 'voice' | 'video') => void;
  expert: Expert;
  expertPrice?: number;
  onStartCall?: (selectedDuration: number) => Promise<void>;
  onSelectCallType?: (type: 'audio' | 'video') => Promise<void>;
}

const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ 
  callType = 'video', 
  onCallTypeChange,
  expert,
  expertPrice,
  onStartCall,
  onSelectCallType
}) => {
  const [selectedDuration, setSelectedDuration] = useState(15); // Default 15 minutes
  const [selectedCallType, setSelectedCallType] = useState<'voice' | 'video'>(callType);
  
  const price = expertPrice || expert.price;

  const handleStartCall = () => {
    if (onStartCall) {
      onStartCall(selectedDuration);
    }
  };

  const handleSelectCallType = (type: 'voice' | 'video') => {
    setSelectedCallType(type);
    if (onCallTypeChange) {
      onCallTypeChange(type);
    }
    if (onSelectCallType) {
      onSelectCallType(type === 'voice' ? 'audio' : 'video');
    }
  };

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
          <Card 
            className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
              selectedCallType === 'video' ? 'border-primary' : ''
            }`}
            onClick={() => handleSelectCallType('video')}
          >
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-lg">Video Call</h3>
              <p className="text-sm text-muted-foreground mt-2">
                See and hear the expert with both video and audio enabled
              </p>
              <p className="mt-4 font-medium">₹{price}/min</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
              selectedCallType === 'voice' ? 'border-primary' : ''
            }`}
            onClick={() => handleSelectCallType('voice')}
          >
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-lg">Audio Call</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Connect with audio only for a more focused conversation
              </p>
              <p className="mt-4 font-medium">₹{price}/min</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex gap-2">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The first 15 minutes are free. After that, you'll be charged at ₹{price} per minute.
            </p>
          </div>
        </div>
        
        {onStartCall && (
          <div className="flex justify-center">
            <Button onClick={handleStartCall} className="w-full max-w-md">
              Start {selectedCallType === 'video' ? 'Video' : 'Audio'} Call
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgoraCallTypeSelector;
