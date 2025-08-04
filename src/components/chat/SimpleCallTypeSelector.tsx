import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Phone, Clock } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface SimpleCallTypeSelectorProps {
  expert: Expert;
  onStartCall: (duration: number, callType: 'video' | 'voice') => Promise<void>;
}

const SimpleCallTypeSelector: React.FC<SimpleCallTypeSelectorProps> = ({
  expert,
  onStartCall
}) => {
  const [selectedCallType, setSelectedCallType] = useState<'voice' | 'video'>('video');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Simple pricing calculation based on expert's base price per minute
  const calculatePrice = (minutes: number) => {
    return expert.price * minutes;
  };

  const handleStartCall = async () => {
    if (!selectedDuration) return;
    
    setIsStarting(true);
    try {
      console.log('Starting call with duration:', selectedDuration, 'type:', selectedCallType);
      await onStartCall(selectedDuration, selectedCallType);
    } catch (error) {
      console.error('Error starting call:', error);
      setIsStarting(false);
    }
  };

  const durationOptions = [
    { duration: 30, description: 'Perfect for quick consultations' },
    { duration: 60, description: 'Perfect for detailed sessions', popular: true }
  ];

  return (
    <div className="space-y-6">
      {/* Call Type Selection */}
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Choose Call Type</CardTitle>
          <CardDescription>
            Select how you'd like to connect with {expert.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
                selectedCallType === 'video' ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedCallType('video')}
            >
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-lg">Video Call</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  See and hear the expert with both video and audio enabled
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
                selectedCallType === 'voice' ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedCallType('voice')}
            >
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-lg">Audio Call</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with audio only for a more focused conversation
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Duration Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Select Call Duration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {durationOptions.map((option) => {
              const price = calculatePrice(option.duration);
              const isSelected = selectedDuration === option.duration;
              
              return (
                <div key={option.duration} className="relative">
                  {option.popular && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Popular
                      </div>
                    </div>
                  )}
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full h-auto p-4 flex justify-between items-center ${
                      option.popular ? 'ring-2 ring-blue-200' : ''
                    }`}
                    onClick={() => setSelectedDuration(option.duration)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {option.duration} minutes
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg">
                        ₹{price}
                      </span>
                      {option.popular && (
                        <span className="text-xs text-green-600">
                          Best Value
                        </span>
                      )}
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Your session will automatically end when the selected duration is reached. 
              You can extend the call if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Proceed to Pay Button */}
      {selectedDuration && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleStartCall} 
            className="w-full max-w-md"
            disabled={isStarting}
            size="lg"
          >
            {isStarting ? 'Starting Call...' : `Proceed to Pay ₹${calculatePrice(selectedDuration)}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleCallTypeSelector;