import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Phone, Clock, DollarSign, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CallType, CallDuration, Expert } from './CallInterface';

interface CallPreSelectionProps {
  expert: Expert;
  onStartCall: (type: CallType, duration: CallDuration) => Promise<void>;
}

export const CallPreSelection: React.FC<CallPreSelectionProps> = ({
  expert,
  onStartCall
}) => {
  const [selectedType, setSelectedType] = useState<CallType>('video');
  const [selectedDuration, setSelectedDuration] = useState<CallDuration>(30);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateCost = (duration: CallDuration) => {
    return duration * expert.pricePerMinute;
  };

  const handleStartCall = async () => {
    setIsProcessing(true);
    try {
      await onStartCall(selectedType, selectedDuration);
    } catch (error) {
      console.error('Failed to start call:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Expert Profile */}
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={expert.imageUrl} alt={expert.name} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{expert.name}</h2>
          <p className="text-sm text-muted-foreground">Expert Consultation</p>
        </div>
      </div>

      {/* Call Type & Duration Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Call Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Call Type</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedType === 'video' ? 'default' : 'outline'}
                onClick={() => setSelectedType('video')}
                size="sm"
                className="h-10"
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              <Button
                variant={selectedType === 'audio' ? 'default' : 'outline'}
                onClick={() => setSelectedType('audio')}
                size="sm"
                className="h-10"
              >
                <Phone className="h-4 w-4 mr-2" />
                Audio
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Duration</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedDuration === 30 ? 'default' : 'outline'}
                onClick={() => setSelectedDuration(30)}
                size="sm"
                className="h-10 justify-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">30 min</span>
              </Button>
              <Button
                variant={selectedDuration === 60 ? 'default' : 'outline'}
                onClick={() => setSelectedDuration(60)}
                size="sm"
                className="h-10 justify-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">60 min</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-primary">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Cost</span>
            </div>
            <div className="text-xl font-bold text-primary">
              ₹{calculateCost(selectedDuration)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {selectedDuration} min {selectedType} call
          </div>
        </CardContent>
      </Card>

      {/* Start Call Button */}
      <Button
        onClick={handleStartCall}
        disabled={isProcessing}
        className="w-full h-10"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            {selectedType === 'video' ? <Video className="h-5 w-5 mr-2" /> : <Phone className="h-5 w-5 mr-2" />}
            Start {selectedType === 'video' ? 'Video' : 'Audio'} Call
          </>
        )}
      </Button>
    </div>
  );
};