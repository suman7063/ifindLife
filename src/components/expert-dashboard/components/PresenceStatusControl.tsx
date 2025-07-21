import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Circle, 
  Clock, 
  UserMinus, 
  Wifi, 
  WifiOff, 
  Settings,
  MessageCircle,
  Bell
} from 'lucide-react';
import { useLazyExpertPresence } from '@/hooks/useLazyExpertPresence';
import { useAwayMessaging } from '@/hooks/useAwayMessaging';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import ExpertStatusIndicator from '@/components/expert-card/ExpertStatusIndicator';
import { toast } from 'sonner';

const PresenceStatusControl: React.FC = () => {
  const { expert } = useSimpleAuth();
  
  // Use lazy presence - expert can see their own status immediately
  const { getExpertStatus } = useLazyExpertPresence();
  const { updateExpertPresence, trackActivity } = useExpertPresence();
  const { getUnreadCount, getAwayMessages } = useAwayMessaging();
  
  const [currentStatus, setCurrentStatus] = useState<'available' | 'busy' | 'away' | 'offline'>('offline');
  const [autoAwayEnabled, setAutoAwayEnabled] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>('');

  useEffect(() => {
    if (expert?.auth_id) {
      const expertStatus = getExpertStatus(expert.auth_id);
      setCurrentStatus(expertStatus.status === 'online' ? 'available' : 
                     expertStatus.status === 'away' ? 'away' : 
                     expertStatus.status === 'offline' ? 'offline' : 'available');
      setLastActivity(expertStatus.lastActivity || '');
      
      // Load unread messages count
      loadUnreadCount();
    }
  }, [expert?.auth_id, getExpertStatus]);

  const loadUnreadCount = async () => {
    if (expert?.auth_id) {
      const count = await getUnreadCount(expert.auth_id);
      setUnreadMessages(count);
    }
  };

  const handleStatusChange = async (newStatus: 'available' | 'busy' | 'away' | 'offline') => {
    if (!expert?.auth_id) return;

    try {
      await updateExpertPresence(expert.auth_id, newStatus);
      setCurrentStatus(newStatus);
      
      if (newStatus === 'available') {
        await trackActivity(expert.auth_id);
      }
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusConfig = (status: typeof currentStatus) => {
    switch (status) {
      case 'available':
        return { icon: Circle, color: 'text-green-600', bg: 'bg-green-50', label: 'Available' };
      case 'busy':
        return { icon: Clock, color: 'text-red-600', bg: 'bg-red-50', label: 'Busy' };
      case 'away':
        return { icon: UserMinus, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Away' };
      default:
        return { icon: WifiOff, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Offline' };
    }
  };

  if (!expert) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Presence Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
          <div className="flex items-center gap-3">
            <ExpertStatusIndicator
              status={currentStatus}
              isOnline={currentStatus !== 'offline'}
              lastActivity={lastActivity}
              awayMessageCount={unreadMessages}
              size="md"
            />
          </div>
          
          {unreadMessages > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={loadUnreadCount}
            >
              <MessageCircle className="h-4 w-4" />
              {unreadMessages} new
            </Button>
          )}
        </div>

        {/* Status Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={currentStatus === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('available')}
            className="gap-2"
          >
            <Circle className="h-4 w-4" />
            Available
          </Button>
          
          <Button
            variant={currentStatus === 'busy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('busy')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Busy
          </Button>
          
          <Button
            variant={currentStatus === 'away' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('away')}
            className="gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Away
          </Button>
          
          <Button
            variant={currentStatus === 'offline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('offline')}
            className="gap-2"
          >
            <WifiOff className="h-4 w-4" />
            Offline
          </Button>
        </div>

        {/* Auto-Away Settings */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="space-y-1">
            <p className="text-sm font-medium">Auto Away</p>
            <p className="text-xs text-gray-500">
              Automatically set to away after 10 minutes of inactivity
            </p>
          </div>
          <Switch
            checked={autoAwayEnabled}
            onCheckedChange={setAutoAwayEnabled}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => trackActivity(expert.auth_id)}
            className="w-full gap-2"
          >
            <Bell className="h-4 w-4" />
            Mark Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresenceStatusControl;