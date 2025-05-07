
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AgoraCallModalHeaderProps {
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
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
  // Determine title and description based on call status
  let title = '';
  let description = '';
  
  switch (callStatus) {
    case 'choosing':
      title = `Call with ${expertName}`;
      description = `Select how you'd like to connect (${currency}${expertPrice}/min)`;
      break;
    case 'connecting':
      title = 'Connecting...';
      description = `Establishing connection with ${expertName}`;
      break;
    case 'connected':
      title = 'Call in Progress';
      description = `Connected with ${expertName}`;
      break;
    case 'ended':
      title = 'Call Ended';
      description = `Your call with ${expertName} has ended`;
      break;
    case 'error':
      title = 'Connection Error';
      description = 'We encountered an issue establishing the call';
      break;
  }
  
  return (
    <DialogHeader className="space-y-2">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl">{title}</DialogTitle>
        {callStatus === 'connected' && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
            Live
          </Badge>
        )}
      </div>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );
};

export default AgoraCallModalHeader;
