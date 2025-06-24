
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';

interface ProtectedBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  onProceed: () => void;
}

const ProtectedBookingDialog: React.FC<ProtectedBookingDialogProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  onProceed
}) => {
  const { isAuthenticated, sessionType } = useAuth();

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-orange-500" />
              <span>Authentication Required</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You need to be logged in to book "{serviceTitle}".</p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => window.location.href = '/user-login'}>
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Secure Booking</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>You're about to book "{serviceTitle}" securely.</p>
          <p className="text-sm text-muted-foreground">
            Session Type: {sessionType || 'Unknown'}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onProceed}>
              Proceed to Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtectedBookingDialog;
