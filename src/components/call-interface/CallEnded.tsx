import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  User, 
  Star,
  Download
} from 'lucide-react';
import { Expert } from './CallInterface';

interface SessionData {
  startTime: Date;
  duration: number;
  cost: number;
}

interface CallEndedProps {
  expert: Expert;
  sessionData: SessionData | null;
  onClose: () => void;
}

export const CallEnded: React.FC<CallEndedProps> = ({
  expert,
  sessionData,
  onClose
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">Call Completed</h2>
          <p className="text-muted-foreground">
            Thank you for your session with {expert.name}
          </p>
        </div>
      </div>

      {/* Expert Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={expert.imageUrl} alt={expert.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{expert.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Expert Consultant</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Session Summary */}
      {sessionData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Duration</span>
              </div>
              <Badge variant="secondary">
                {formatDuration(sessionData.duration)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Cost</span>
              </div>
              <Badge variant="default">
                ₹{sessionData.cost}
              </Badge>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Session started: {formatTime(sessionData.startTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How was your session?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-yellow-100"
              >
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
              </Button>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Tap a star to rate your experience
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Session Summary
        </Button>
        
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
};