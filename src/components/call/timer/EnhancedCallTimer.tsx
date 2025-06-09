
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedCallTimerProps {
  duration: number; // current duration in seconds
  selectedDurationMinutes: number; // selected duration in minutes
  onExtendCall?: () => void;
  formatTime: (seconds: number) => string;
  className?: string;
}

export const EnhancedCallTimer: React.FC<EnhancedCallTimerProps> = ({
  duration,
  selectedDurationMinutes,
  onExtendCall,
  formatTime,
  className = ''
}) => {
  const [timeStatus, setTimeStatus] = useState<'normal' | 'warning' | 'overtime'>('normal');
  
  const selectedDurationSeconds = selectedDurationMinutes * 60;
  const remainingTime = Math.max(0, selectedDurationSeconds - duration);
  const isOvertime = duration > selectedDurationSeconds;
  const warningThreshold = selectedDurationSeconds * 0.9; // Warning at 90% of time
  
  useEffect(() => {
    if (isOvertime) {
      setTimeStatus('overtime');
    } else if (duration > warningThreshold) {
      setTimeStatus('warning');
    } else {
      setTimeStatus('normal');
    }
  }, [duration, warningThreshold, isOvertime]);

  const getStatusColor = () => {
    switch (timeStatus) {
      case 'warning': return 'text-orange-600';
      case 'overtime': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getProgressPercentage = () => {
    if (isOvertime) return 100;
    return Math.min((duration / selectedDurationSeconds) * 100, 100);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Timer Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Call Duration</span>
            </div>
            <Badge variant={timeStatus === 'overtime' ? 'destructive' : 'default'}>
              {timeStatus === 'overtime' ? 'Overtime' : 'Active'}
            </Badge>
          </div>

          {/* Time Display */}
          <div className="text-center space-y-2">
            <div className={`text-3xl font-mono font-bold ${getStatusColor()}`}>
              {formatTime(duration)}
            </div>
            
            {!isOvertime && (
              <div className="text-sm text-muted-foreground">
                {formatTime(remainingTime)} remaining
              </div>
            )}

            {isOvertime && (
              <div className="flex items-center justify-center space-x-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {formatTime(duration - selectedDurationSeconds)} overtime
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeStatus === 'overtime' 
                  ? 'bg-red-500' 
                  : timeStatus === 'warning' 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Session Info */}
          <div className="text-center text-sm text-muted-foreground">
            Selected Duration: {selectedDurationMinutes} minutes
          </div>

          {/* Extend Call Button */}
          {timeStatus === 'warning' && onExtendCall && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onExtendCall}
            >
              <Plus className="h-4 w-4 mr-2" />
              Extend Call (+15 min)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCallTimer;
