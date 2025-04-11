
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import AgoraCallTypeSelector from './AgoraCallTypeSelector';
import { ExpertProfile } from '@/types/supabase/expert';

export interface AgoraCallInfoProps {
  expertName?: string;
  expertPrice?: number;
  onCallTypeChange: (type: 'audio' | 'video') => void;
  selectedCallType: 'audio' | 'video';
  onStartCall: () => Promise<boolean>;
  isConnecting: boolean;
}

const AgoraCallInfo: React.FC<AgoraCallInfoProps> = ({
  expertName,
  expertPrice,
  onCallTypeChange,
  selectedCallType,
  onStartCall,
  isConnecting
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Connect with {expertName || 'Expert'}
        </h2>
        <p className="text-muted-foreground">
          {expertPrice !== undefined ? 
            `₹${expertPrice}/min - Secure and high-quality call` : 
            'Secure and high-quality call'}
        </p>
      </div>
      
      <AgoraCallTypeSelector
        selectedType={selectedCallType}
        onSelect={onCallTypeChange}
      />
      
      <div className="w-full max-w-xs">
        <Button 
          onClick={onStartCall}
          disabled={isConnecting}
          className="w-full h-12 bg-ifind-aqua hover:bg-ifind-teal"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current mr-2"></div>
              Connecting...
            </>
          ) : (
            `Start ${selectedCallType === 'video' ? 'Video' : 'Audio'} Call`
          )}
        </Button>
        
        <p className="text-xs text-center mt-2 text-muted-foreground">
          <AlertCircle className="inline h-3 w-3 mr-1" />
          You can end the call at any time
        </p>
      </div>
    </div>
  );
};

export default AgoraCallInfo;
