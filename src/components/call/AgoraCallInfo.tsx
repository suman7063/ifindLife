
import React from 'react';
import { Clock, DollarSign } from 'lucide-react';

interface AgoraCallInfoProps {
  duration: number;
  remainingTime: number;
  cost: number;
  formatTime: (seconds: number) => string;
  pricePerMinute: number;
}

const AgoraCallInfo: React.FC<AgoraCallInfoProps> = ({
  duration,
  remainingTime,
  cost,
  formatTime,
  pricePerMinute
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 py-2">
      {/* Call duration */}
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-lg font-semibold">{formatTime(duration)}</span>
      </div>
      
      {/* Remaining time */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-muted-foreground mb-1">Remaining time:</div>
        <div className={`text-base font-semibold ${remainingTime < 60 ? 'text-red-500' : ''}`}>
          {formatTime(remainingTime)}
        </div>
      </div>

      {/* Cost information */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-muted-foreground">
          First 15 mins free, then ₹{pricePerMinute}/min
        </div>
        {cost > 0 && (
          <div className="flex items-center mt-1">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-semibold">₹{cost.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgoraCallInfo;
