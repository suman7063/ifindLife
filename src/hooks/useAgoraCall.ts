
import { useState, useEffect } from 'react';
import { useCallTimer } from './useCallTimer';

export const useAgoraCall = (initialDuration = 0, ratePerMinute = 0) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const callTimer = useCallTimer(initialDuration, ratePerMinute);
  
  const {
    duration,
    cost,
    remainingTime,
    isExtending,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost
  } = callTimer;
  
  // Handle connection status changes
  useEffect(() => {
    if (isConnected && hasJoined) {
      startTimers(initialDuration, ratePerMinute);
    } else {
      stopTimers();
    }
  }, [isConnected, hasJoined]);
  
  // Connect to call
  const connectToCall = () => {
    setIsConnected(true);
  };
  
  // Disconnect from call
  const disconnectFromCall = () => {
    setIsConnected(false);
    setHasJoined(false);
  };
  
  // Join the channel
  const joinChannel = (channelName: string, token: string) => {
    // Implementation would include actual Agora SDK calls
    console.log('Joining channel:', channelName, 'with token:', token);
    setHasJoined(true);
    return true; // Return boolean for success
  };
  
  return {
    isConnected,
    hasJoined,
    duration,
    cost,
    remainingTime,
    isExtending,
    connectToCall,
    disconnectFromCall,
    joinChannel,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost
  };
};

export default useAgoraCall;
