import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  PhoneOff, 
  Users, 
  Clock,
  Bell,
  BellOff
} from 'lucide-react';

interface CallStatusIndicatorProps {
  isListening: boolean;
  pendingCallsCount: number;
  hasActiveCall?: boolean;
  onToggleListening: () => void;
  onShowPendingCalls?: () => void;
}

const CallStatusIndicator: React.FC<CallStatusIndicatorProps> = ({
  isListening,
  pendingCallsCount,
  hasActiveCall = false,
  onToggleListening,
  onShowPendingCalls
}) => {
  console.log('3333333', isListening);
  return (
    <div className="flex items-center space-x-3">
      {/* Call Reception Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`} />
        <span className="text-sm text-muted-foreground">
          {isListening ? 'Available for calls' : 'Unavailable'}
        </span>
      </div>

      {/* Pending Calls Badge */}
      {pendingCallsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowPendingCalls}
          className="relative"
        >
          <Phone className="w-4 h-4 mr-1" />
          <span>{pendingCallsCount}</span>
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 text-xs min-w-[1.2rem] h-5"
          >
            {pendingCallsCount}
          </Badge>
        </Button>
      )}

      {/* Active Call Indicator */}
      {hasActiveCall && (
        <Badge variant="default" className="bg-green-600">
          <Users className="w-3 h-3 mr-1" />
          In Call
        </Badge>
      )}

      {/* Toggle Listening Button */}
      <Button
        variant={isListening ? "destructive" : "default"}
        size="sm"
        onClick={onToggleListening}
        className="flex items-center space-x-1"
      >
        {isListening ? (
          <>
            <BellOff className="w-4 h-4" />
            <span>Go Offline</span>
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            <span>Go Online</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default CallStatusIndicator;