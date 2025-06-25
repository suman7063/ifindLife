
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AuthRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
  isOpen,
  onClose,
  serviceTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p>Please log in to select an expert for "{serviceTitle}"</p>
          <button 
            onClick={() => {
              window.location.href = '/user-login';
            }}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Login
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredDialog;
