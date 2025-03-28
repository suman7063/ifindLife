
import React from 'react';

interface CallTimerProps {
  duration: number;
  callStatus: 'connecting' | 'connected' | 'ended';
}

const CallTimer: React.FC<CallTimerProps> = ({ duration, callStatus }) => {
  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {callStatus === 'connected' && (
        <div className="text-2xl font-semibold">{formatDuration(duration)}</div>
      )}
      
      {callStatus === 'ended' && (
        <div className="text-sm text-muted-foreground">
          Duration: {formatDuration(duration)}
        </div>
      )}
    </>
  );
};

export default CallTimer;
