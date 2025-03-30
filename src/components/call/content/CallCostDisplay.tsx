
import React from 'react';
import { Clock, DollarSign } from 'lucide-react';

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
  return (
    <div className="flex flex-col space-y-4 p-2 bg-background/50 backdrop-blur-sm rounded-md">
      {/* Call duration */}
      <div className="flex items-center justify-center">
        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-lg font-medium">{formatTime(duration)}</span>
      </div>
      
      {/* Remaining time */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-muted-foreground mb-1">Remaining time:</div>
        <div className={`text-base font-medium ${remainingTime < 60 ? 'text-red-500' : ''}`}>
          {formatTime(remainingTime)}
        </div>
      </div>

      {/* Cost information */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-muted-foreground">
          First 15 mins free, then ₹{expertPrice}/min
        </div>
        {cost > 0 && (
          <div className="flex items-center mt-1">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-medium">₹{cost.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallCostDisplay;
