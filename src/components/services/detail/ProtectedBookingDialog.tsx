
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { useAuthProtection } from '@/utils/authProtection';
import EnhancedExpertSelectionModal from '@/components/expert/EnhancedExpertSelectionModal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
  serviceType: 'service' | 'program';
}

const ProtectedBookingDialog: React.FC<ProtectedBookingDialogProps> = ({
  open,
  onOpenChange,
  serviceTitle,
  serviceType
}) => {
  const { isAuthenticated, isLoading, sessionType } = useEnhancedUnifiedAuth();
  const { startProtection, endProtection, isProtected } = useAuthProtection();
  const [showExpertSelection, setShowExpertSelection] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);

  // Start protection when dialog opens
  useEffect(() => {
    if (open && isAuthenticated) {
      const id = `booking_${serviceTitle}_${Date.now()}`;
      setOperationId(id);
      startProtection(id, 'booking');
      console.log('🔒 Started booking protection for:', serviceTitle);
    }
    
    return () => {
      if (operationId) {
        endProtection(operationId);
        console.log('🔒 Ended booking protection for:', serviceTitle);
      }
    };
  }, [open, isAuthenticated, serviceTitle]);

  // Handle dialog close with protection cleanup
  const handleClose = () => {
    if (operationId) {
      endProtection(operationId);
      setOperationId(null);
    }
    setShowExpertSelection(false);
    onOpenChange(false);
  };

  // Handle proceed to expert selection
  const handleProceedToExpertSelection = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      handleClose();
      // Redirect to login with return path
      const currentPath = window.location.pathname;
      window.location.href = `/user-login?returnTo=${encodeURIComponent(currentPath)}&action=booking&service=${encodeURIComponent(serviceTitle)}`;
      return;
    }

    setShowExpertSelection(true);
  };

  // Handle expert selection (this is where the critical auth operation happens)
  const handleExpertSelected = (expertId: number) => {
    console.log('🔒 Expert selected during protected booking:', expertId);
    // The expert selection will handle its own auth protection
    setShowExpertSelection(false);
    handleClose();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open && !showExpertSelection} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {isProtected() && <Lock className="h-5 w-5 text-green-600" />}
              <span>Book {serviceTitle}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Login Required
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Please log in to book this {serviceType}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      const currentPath = window.location.pathname;
                      window.location.href = `/user-login?returnTo=${encodeURIComponent(currentPath)}&action=booking&service=${encodeURIComponent(serviceTitle)}`;
                    }}
                    className="flex-1"
                  >
                    Login to Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isProtected() && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
                    <Lock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Session Protected
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        Your authentication is secured during this booking process
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Ready to Book</h3>
                  <p className="text-gray-600 text-sm">
                    You're about to book "{serviceTitle}". Choose an expert to continue.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleProceedToExpertSelection} className="flex-1">
                    Choose Expert
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Expert Selection Modal with Auth Protection */}
      {showExpertSelection && (
        <EnhancedExpertSelectionModal
          isOpen={showExpertSelection}
          onClose={() => {
            setShowExpertSelection(false);
            handleClose();
          }}
          onExpertSelected={handleExpertSelected}
          serviceTitle={serviceTitle}
        />
      )}
    </>
  );
};

export default ProtectedBookingDialog;
