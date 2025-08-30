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
    <div className="p-6 space-y-6">
      {/* Expert Profile */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={expert.imageUrl} alt={expert.name} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{expert.name}</h2>
          <p className="text-muted-foreground">Expert Consultation</p>
          <Badge variant="secondary" className="mt-1">
            ₹{expert.pricePerMinute}/minute
          </Badge>
        </div>
      </div>

      {/* Call Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Call Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedType === 'video' ? 'default' : 'outline'}
              onClick={() => setSelectedType('video')}
              className="h-16 flex-col space-y-2"
            >
              <Video className="h-6 w-6" />
              <span>Video Call</span>
            </Button>
            <Button
              variant={selectedType === 'audio' ? 'default' : 'outline'}
              onClick={() => setSelectedType('audio')}
              className="h-16 flex-col space-y-2"
            >
              <Phone className="h-6 w-6" />
              <span>Audio Call</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duration Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Duration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedDuration === 30 ? 'default' : 'outline'}
              onClick={() => setSelectedDuration(30)}
              className="h-20 flex-col space-y-2"
            >
              <Clock className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">30 minutes</div>
                <div className="text-sm text-muted-foreground">
                  ₹{calculateCost(30)}
                </div>
              </div>
            </Button>
            <Button
              variant={selectedDuration === 60 ? 'default' : 'outline'}
              onClick={() => setSelectedDuration(60)}
              className="h-20 flex-col space-y-2"
            >
              <Clock className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">60 minutes</div>
                <div className="text-sm text-muted-foreground">
                  ₹{calculateCost(60)}
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card className="border-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium">Total Cost</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ₹{calculateCost(selectedDuration)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {selectedDuration} minute {selectedType} call with {expert.name}
          </div>
        </CardContent>
      </Card>

      {/* Start Call Button */}
      <Button
        onClick={handleStartCall}
        disabled={isProcessing}
        size="lg"
        className="w-full h-12"
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