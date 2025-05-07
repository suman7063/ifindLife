
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

interface CallCostDisplayProps {
  duration: number;
  remainingTime: number;
  cost: number;
  formatTime: (seconds: number) => string;
  expertPrice: number;
}

const CallCostDisplay: React.FC<CallCostDisplayProps> = ({
  duration,
  remainingTime,
  cost,
  formatTime,
  expertPrice
}) => {
  const initialDuration = 15 * 60; // 15 minutes in seconds
  const timeUsedPercentage = ((initialDuration - remainingTime) / initialDuration) * 100;
  const showExtensionWarning = remainingTime <= 60; // Show warning when less than 1 minute remains
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Call Duration</p>
            <p className="font-medium">{formatTime(duration)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Cost</p>
            <p className="font-medium">₹{cost.toFixed(2)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Time Remaining</p>
            <p className="font-medium">{formatTime(remainingTime)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-medium">₹{expertPrice}/min</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Time Used</span>
            <span>{Math.min(100, Math.round(timeUsedPercentage))}%</span>
          </div>
          <Progress 
            value={Math.min(100, timeUsedPercentage)} 
            className={`${showExtensionWarning ? 'bg-red-200 dark:bg-red-900/30' : ''}`}
          />
        </div>
        
        {showExtensionWarning && (
          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md flex gap-2 items-center">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-400">
              Initial time slot ending soon. The call will be automatically extended at the standard rate.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallCostDisplay;
