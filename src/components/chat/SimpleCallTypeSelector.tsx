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
      {/* Call Type Selection - Compact circular icons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Choose Call Type</h3>
        
        <div className="flex justify-center gap-6">
          {/* Video Call Option */}
          <button
            className={`group flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
              selectedCallType === 'video' 
                ? 'bg-primary/10 border-2 border-primary' 
                : 'hover:bg-muted/50 border-2 border-transparent'
            }`}
            onClick={() => setSelectedCallType('video')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedCallType === 'video'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
            }`}>
              <Video className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${
              selectedCallType === 'video' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              Video
            </span>
          </button>

          {/* Voice Call Option */}
          <button
            className={`group flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
              selectedCallType === 'voice' 
                ? 'bg-primary/10 border-2 border-primary' 
                : 'hover:bg-muted/50 border-2 border-transparent'
            }`}
            onClick={() => setSelectedCallType('voice')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedCallType === 'voice'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
            }`}>
              <Phone className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${
              selectedCallType === 'voice' ? 'text-primary' : 'text-muted-foreground'
            }`}>
              Voice
            </span>
          </button>
        </div>
      </div>

      {/* Duration Selection - Compact design */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Select Duration
        </h3>
        
        <div className="flex justify-center gap-4">
          {durationOptions.map((option) => {
            const price = calculatePrice(option.duration);
            const isSelected = selectedDuration === option.duration;
            
            return (
              <button
                key={option.duration}
                className={`relative p-4 rounded-lg border-2 transition-all min-w-[120px] ${
                  isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDuration(option.duration)}
              >
                {option.popular && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </div>
                  </div>
                )}
                <div className="text-center space-y-1">
                  <div className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                    {option.duration} min
                  </div>
                  <div className={`text-lg font-bold ${isSelected ? 'text-primary' : ''}`}>
                    ₹{price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pay to Proceed Button */}
      {selectedDuration && (
        <div className="space-y-3 pt-2">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="text-lg font-bold text-primary">₹{calculatePrice(selectedDuration)}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleStartCall} 
              className="w-full max-w-xs"
              disabled={isStarting}
              size="lg"
            >
              {isStarting ? 'Processing...' : 'Pay to Proceed'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCallTypeSelector;