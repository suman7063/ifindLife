
export interface CallState {
  localStream?: any;
  remoteStream?: any;
  channelName?: string;
  token?: string;
  uid?: number;
  isConnecting: boolean;
  isConnected: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const calculateCallCost = (
  duration: number, 
  pricePerMinute: number, 
  freeMinutes: number = 15
): number => {
  // Convert duration from seconds to minutes
  const durationInMinutes = duration / 60;
  
  // If the duration is within free minutes, no cost
  if (durationInMinutes <= freeMinutes) {
    return 0;
  }
  
  // Calculate billable minutes (rounded to nearest minute)
  const billableMinutes = Math.ceil(durationInMinutes - freeMinutes);
  
  // Calculate cost
  const cost = billableMinutes * pricePerMinute;
  
  return parseFloat(cost.toFixed(2)); // Round to 2 decimal places
};
