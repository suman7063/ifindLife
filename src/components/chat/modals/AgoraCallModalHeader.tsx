
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChatStatus } from '@/hooks/chat/useChatModalState';

interface AgoraCallModalHeaderProps {
  callStatus: ChatStatus;
  expertName: string;
  currency: string;
  expertPrice: number;
}

const AgoraCallModalHeader: React.FC<AgoraCallModalHeaderProps> = ({
  callStatus,
  expertName,
  currency,
  expertPrice
}) => {
  const getStatusDisplayText = () => {
    switch (callStatus) {
      case 'choosing':
        return null;
      case 'connecting':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Connecting...</Badge>;
      case 'connected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
      case 'ended':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Call Ended</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Connection Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-medium">{expertName}</h2>
        {callStatus !== 'choosing' && (
          <p className="text-sm text-muted-foreground">{currency}{expertPrice}/min after free period</p>
        )}
      </div>
      {getStatusDisplayText()}
    </div>
  );
};

export default AgoraCallModalHeader;
