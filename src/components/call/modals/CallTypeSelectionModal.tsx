/**
 * Call Type Selection Modal
 * Allows user to select call type (video/audio) and duration
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Phone, Clock } from 'lucide-react';

interface CallTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertPrice?: number;
  onStartCall: (callType: 'audio' | 'video', duration: number) => void;
}

const CallTypeSelectionModal: React.FC<CallTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  expertName,
  expertPrice = 30,
  onStartCall
}) => {
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [duration, setDuration] = useState(15); // minutes

  const durations = [5, 10, 15, 30, 60];

  const handleStart = async () => {
    // Check browser permissions
    try {
      if (callType === 'video') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
      
      onStartCall(callType, duration);
    } catch (error) {
      const err = error as Error & { name?: string };
      if (err.name === 'NotAllowedError') {
        alert('Please allow camera/microphone access to start the call');
      } else if (err.name === 'NotFoundError') {
        alert('No camera/microphone found. Please connect a device.');
      } else {
        alert('Unable to access camera/microphone. Please check your device settings.');
      }
    }
  };

  const estimatedCost = (duration * expertPrice) / 60;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Call with {expertName}</DialogTitle>
          <DialogDescription>
            Choose call type and duration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Call Type</label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${
                  callType === 'video' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCallType('video')}
              >
                <CardContent className="p-4 text-center">
                  <Video className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Video Call</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all ${
                  callType === 'audio' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCallType('audio')}
              >
                <CardContent className="p-4 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Audio Call</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {durations.map((dur) => (
                <Button
                  key={dur}
                  variant={duration === dur ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDuration(dur)}
                >
                  {dur}m
                </Button>
              ))}
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Cost:</span>
              <span className="text-lg font-semibold">₹{estimatedCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleStart} className="flex-1">
              Start Call
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallTypeSelectionModal;

