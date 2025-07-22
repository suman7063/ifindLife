import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Circle, Clock, UserMinus, Wifi, WifiOff } from 'lucide-react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

const StatusControlWidget: React.FC = () => {
  const { expert } = useSimpleAuth();
  const { updateExpertPresence, getExpertPresence } = useExpertPresence();

  if (!expert?.auth_id) return null;

  const presenceData = getExpertPresence(expert.auth_id);
  const currentStatus = presenceData?.status || 'offline';
  const isAvailable = presenceData?.isAvailable || false;

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
      case 'online':
        return {
          icon: <Circle className="h-3 w-3 fill-green-500 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          label: 'Available'
        };
      case 'away':
        return {
          icon: <Clock className="h-3 w-3 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Away'
        };
      case 'offline':
      default:
        return {
          icon: <UserMinus className="h-3 w-3 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800',
          label: 'Offline'
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Online Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {statusConfig.icon}
            <span className="font-medium">Current Status:</span>
          </div>
          <Badge className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Status Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={currentStatus === 'online' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('available')}
            className="flex items-center gap-1"
          >
            <Circle className="h-3 w-3 fill-green-500 text-green-500" />
            Available
          </Button>
          
          <Button
            variant={currentStatus === 'away' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('away')}
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3 text-yellow-500" />
            Away
          </Button>
          
          <Button
            variant={currentStatus === 'offline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('offline')}
            className="flex items-center gap-1 col-span-2"
          >
            <WifiOff className="h-3 w-3 text-gray-500" />
            Go Offline
          </Button>
        </div>

        {/* Status Information */}
        <div className="text-sm text-muted-foreground">
          {isAvailable ? (
            <p className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              Ready to receive calls and appointments
            </p>
          ) : (
            <p className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-gray-500 text-gray-500" />
              Not accepting new calls
            </p>
          )}
        </div>

        {/* Expert Account Status Warning */}
        {expert.status !== 'approved' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Your expert account is pending approval. You'll be able to receive calls once approved.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusControlWidget;