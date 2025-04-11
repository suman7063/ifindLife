
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExpertProfile } from '@/types/expert';
import { AgoraCallTypeSelector } from './AgoraCallTypeSelector';

export interface AgoraCallInfoProps {
  expert?: ExpertProfile | null;
  expertName?: string;
  expertPrice?: number;
  onCallTypeChange: (type: 'audio' | 'video') => void;
  selectedCallType: 'audio' | 'video';
  onStartCall: () => Promise<boolean>;
  isConnecting: boolean;
}

const AgoraCallInfo: React.FC<AgoraCallInfoProps> = ({
  expert,
  expertName,
  expertPrice,
  onCallTypeChange,
  selectedCallType,
  onStartCall,
  isConnecting
}) => {
  const displayName = expertName || expert?.name || 'Expert';
  const price = expertPrice || expert?.price_per_min || 0;
  
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Call with {displayName}</h3>
        <p className="text-muted-foreground">
          Select how you would like to connect
        </p>
      </div>
      
      <AgoraCallTypeSelector 
        selectedType={selectedCallType}
        onSelect={onCallTypeChange}
      />
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Rate: ₹{price}/minute
        </p>
        <p className="text-sm text-muted-foreground">
          First 15 minutes free
        </p>
      </div>
      
      <Button
        onClick={() => onStartCall()}
        disabled={isConnecting}
        className="w-full bg-ifind-aqua hover:bg-ifind-teal text-white py-2 rounded-md"
      >
        {isConnecting ? 'Connecting...' : 'Start Call'}
      </Button>
    </div>
  );
};

export default AgoraCallInfo;
