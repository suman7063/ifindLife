import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';
import { CallState } from '../CallInterface';

interface SessionData {
  startTime: Date;
  duration: number;
  cost: number;
}

interface CallTimerProps {
  duration: number; // Total duration in minutes
  sessionData: SessionData | null;
  callState: CallState;
}

export const CallTimer: React.FC<CallTimerProps> = ({
  duration,
  sessionData,
  callState
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState<'3min' | '30sec' | null>(null);

  const totalSeconds = duration * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const progress = (elapsedSeconds / totalSeconds) * 100;

  useEffect(() => {
    if (callState !== 'connected' || !sessionData) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - sessionData.startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);

      // Show warnings
      const remaining = totalSeconds - elapsed;
      if (remaining <= 30 && remaining > 0 && warningType !== '30sec') {
        setWarningType('30sec');
        setShowWarning(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowWarning(false), 5000);
      } else if (remaining <= 180 && remaining > 30 && warningType !== '3min') {
        setWarningType('3min');
        setShowWarning(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowWarning(false), 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callState, sessionData, totalSeconds, warningType]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (remainingSeconds <= 30) return 'bg-destructive';
    if (remainingSeconds <= 180) return 'bg-warning';
    return 'bg-primary';
  };

  const getTimerColor = () => {
    if (remainingSeconds <= 30) return 'text-destructive';
    if (remainingSeconds <= 180) return 'text-warning';
    return 'text-foreground';
  };

  return (
    <div className="space-y-3">
      {/* Warning Alert */}
      {showWarning && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            {warningType === '30sec' 
              ? 'Call will end in 30 seconds!' 
              : 'Call will end in 3 minutes!'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Timer Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-sm text-muted-foreground">
              Elapsed Time
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xl font-mono font-semibold ${getTimerColor()}`}>
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-sm text-muted-foreground">
            Remaining
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2" 
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{formatTime(totalSeconds)}</span>
        </div>
      </div>

      {/* Session Info */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {duration} min session
        </Badge>
        {sessionData && (
          <Badge variant="outline">
            Cost: ₹{sessionData.cost}
          </Badge>
        )}
      </div>
    </div>
  );
};