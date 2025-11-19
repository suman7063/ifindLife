import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Circle, Clock, UserMinus, Wifi, WifiOff, Phone, PhoneOff } from 'lucide-react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

type ExpertStatus = 'available' | 'busy' | 'away' | 'offline';

const MasterStatusControl: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { updateExpertPresence, getExpertPresence, checkExpertPresence, bulkCheckPresence } = useExpertPresence();
  const [currentStatus, setCurrentStatus] = useState<ExpertStatus>('offline');
  const [acceptingCalls, setAcceptingCalls] = useState(false);

  useEffect(() => {
    if (!expert?.auth_id) {
      return;
    }

    // Always verify presence from DB on mount/refresh to restore state
    (async () => {
      try {
        const presence = await checkExpertPresence(expert.auth_id);
        const mappedStatus = presence.status === 'available' ? 'available' :
                            presence.status === 'busy' ? 'busy' :
                            presence.status === 'away' ? 'away' : 'offline';
        setCurrentStatus(mappedStatus);
        setAcceptingCalls(!!presence.acceptingCalls && mappedStatus !== 'offline');
      } catch (e) {
        // Fallback to any cached state if network fails
        const cached = getExpertPresence(expert.auth_id);
        if (cached) {
          const mappedStatus = cached.status === 'available' ? 'available' :
                              cached.status === 'busy' ? 'busy' :
                              cached.status === 'away' ? 'away' : 'offline';
          setCurrentStatus(mappedStatus);
          setAcceptingCalls(!!cached.acceptingCalls && mappedStatus !== 'offline');
        }
      }
    })();
  }, [expert?.auth_id, getExpertPresence, checkExpertPresence]);

  const refreshSelfPresence = async () => {
    if (!expert?.auth_id) return;
    try {
      await bulkCheckPresence([String(expert.auth_id)]);
    } catch (e) {
      console.warn('Presence refresh failed', e);
    }
  };

  const handleStatusChange = async (newStatus: ExpertStatus) => {
    if (!expert?.auth_id) return;

    try {
      // Robust transition rules
      // - offline: force accepting calls to false
      // - available: enable accepting calls
      // - busy/away: preserve current switch
      const callAcceptance = newStatus === 'offline' ? false : newStatus === 'available' ? true : acceptingCalls;
      
      await updateExpertPresence(expert.auth_id, newStatus, callAcceptance);
      
      // Immediately reflect in local UI
      setCurrentStatus(newStatus);
      setAcceptingCalls(callAcceptance);

      // Confirm from DB and sync state (handles any race conditions)
      const confirmed = await checkExpertPresence(expert.auth_id);
      const mapped = confirmed.status === 'available' ? 'available' : confirmed.status === 'busy' ? 'busy' : confirmed.status === 'away' ? 'away' : 'offline';
      setCurrentStatus(mapped);
      setAcceptingCalls(!!confirmed.acceptingCalls && mapped !== 'offline');

      await refreshSelfPresence();
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleCallAcceptanceToggle = async (accepting: boolean) => {
    if (!expert?.auth_id) return;

    try {
      // If enabling call acceptance but currently offline, set to available
      if (accepting && currentStatus === 'offline') {
        await handleStatusChange('available');
      }
      
      // Update the presence system with call acceptance status
      await updateExpertPresence(expert.auth_id, currentStatus, accepting);
      setAcceptingCalls(accepting);

      await refreshSelfPresence();
      
      toast.success(accepting ? 'Now accepting calls' : 'No longer accepting calls');
    } catch (error) {
      console.error('Error updating call acceptance:', error);
      toast.error('Failed to update call settings');
    }
  };

  const getStatusConfig = (status: ExpertStatus) => {
    switch (status) {
      case 'available':
        return {
          icon: <Circle className="h-4 w-4 fill-green-500 text-green-500" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Available',
          description: 'Visible to clients and ready for consultations'
        };
      case 'busy':
        return {
          icon: <Clock className="h-4 w-4 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Busy',
          description: 'Visible to clients but currently in a session'
        };
      case 'away':
        return {
          icon: <UserMinus className="h-4 w-4 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Away',
          description: 'Visible to clients but temporarily unavailable'
        };
      case 'offline':
      default:
        return {
          icon: <WifiOff className="h-4 w-4 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Offline',
          description: 'Not visible to clients'
        };
    }
  };

  if (!expert?.auth_id) return null;

  const statusConfig = getStatusConfig(currentStatus);
  const canAcceptCalls = currentStatus !== 'offline' && expert.status === 'approved';

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Online Status & Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Display */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${statusConfig.color}`}>
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <div>
              <div className="font-medium">{statusConfig.label}</div>
              <div className="text-sm opacity-75">{statusConfig.description}</div>
            </div>
          </div>
          <Badge variant="outline" className="bg-white">
            {currentStatus}
          </Badge>
        </div>

        {/* Status Control Buttons */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Set Your Status:</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentStatus === 'available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('available')}
              className="flex items-center gap-2"
            >
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              Available
            </Button>
            
            <Button
              variant={currentStatus === 'busy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('busy')}
              className="flex items-center gap-2"
            >
              <Clock className="h-3 w-3 text-orange-500" />
              Busy
            </Button>
            
            <Button
              variant={currentStatus === 'away' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('away')}
              className="flex items-center gap-2"
            >
              <UserMinus className="h-3 w-3 text-yellow-500" />
              Away
            </Button>
            
            <Button
              variant={currentStatus === 'offline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('offline')}
              className="flex items-center gap-2"
            >
              <WifiOff className="h-3 w-3 text-gray-500" />
              Offline
            </Button>
          </div>
        </div>

        {/* Call Reception Control */}
        <div className={`p-4 rounded-lg border ${acceptingCalls ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {acceptingCalls ? (
                <Phone className="h-5 w-5 text-green-600" />
              ) : (
                <PhoneOff className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium">Call Reception</div>
                <div className="text-sm text-gray-600">
                  {acceptingCalls ? 'Ready to receive incoming calls' : 'Not accepting calls'}
                </div>
              </div>
            </div>
            <Switch
              checked={acceptingCalls}
              onCheckedChange={handleCallAcceptanceToggle}
              disabled={!canAcceptCalls}
            />
          </div>
          
          {!canAcceptCalls && expert.status !== 'approved' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Your expert account is pending approval. You'll be able to receive calls once approved.
              </p>
            </div>
          )}
          
          {!canAcceptCalls && expert.status === 'approved' && currentStatus === 'offline' && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Set your status to Available, Busy, or Away to enable call reception.
              </p>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">How this works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Available:</strong> Clients can see you're online and book calls</li>
            <li><strong>Busy:</strong> Clients see you're online but currently occupied</li>
            <li><strong>Away:</strong> Clients see you're temporarily unavailable</li>
            <li><strong>Offline:</strong> You're invisible to clients on the website</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterStatusControl;