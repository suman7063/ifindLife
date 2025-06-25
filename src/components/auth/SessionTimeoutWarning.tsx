
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';
import { useSecurity } from '@/contexts/auth/SecurityContext';

const SessionTimeoutWarning: React.FC = () => {
  const { sessionTimeout, extendSession, forceLogout } = useSecurity();
  const [showWarning, setShowWarning] = useState(false);

  // Show warning when 5 minutes remaining
  const WARNING_THRESHOLD = 5 * 60 * 1000;

  useEffect(() => {
    if (sessionTimeout > 0 && sessionTimeout <= WARNING_THRESHOLD && !showWarning) {
      setShowWarning(true);
    } else if (sessionTimeout > WARNING_THRESHOLD) {
      setShowWarning(false);
    }
  }, [sessionTimeout, showWarning]);

  const handleExtendSession = () => {
    extendSession();
    setShowWarning(false);
  };

  const handleLogout = async () => {
    await forceLogout();
    setShowWarning(false);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning || sessionTimeout <= 0) {
    return null;
  }

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Session Expiring Soon</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your session will expire in <strong>{formatTime(sessionTimeout)}</strong> due to inactivity.
              You will be automatically logged out for security reasons.
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleExtendSession}
              className="flex-1"
            >
              Stay Logged In
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex-1"
            >
              Logout Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutWarning;
