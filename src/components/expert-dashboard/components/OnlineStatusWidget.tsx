
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Circle, Clock, UserMinus, Wifi, WifiOff } from 'lucide-react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

const OnlineStatusWidget: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { updateExpertPresence, getExpertPresence } = useExpertPresence();

  if (!expert?.auth_id) return null;

  const presenceData = getExpertPresence(expert.auth_id);
  const currentStatus = presenceData?.status || 'offline';
  const isOnline = presenceData?.isOnline || false;

  const handleStatusChange = async (newStatus: 'available' | 'busy' | 'away' | 'offline') => {
    try {
      await updateExpertPresence(expert.auth_id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusConfig = (status: string) => {
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

  const statusConfig = getStatusConfig(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Online Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${statusConfig.bg}`}>
          <statusConfig.icon className={`h-5 w-5 ${statusConfig.color}`} />
          <div>
            <p className="font-medium">{statusConfig.label}</p>
            <p className="text-sm text-gray-500">
              {isOnline ? 'You are online and visible to clients' : 'You appear offline to clients'}
            </p>
          </div>
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

        {expert.status !== 'approved' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your expert account is pending approval. You'll be able to receive calls once approved.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineStatusWidget;
