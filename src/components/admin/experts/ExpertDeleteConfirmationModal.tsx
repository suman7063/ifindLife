import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExpertDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  expertName: string;
  expertId: string;
}

const ExpertDeleteConfirmationModal: React.FC<ExpertDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expertName,
  expertId
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const expectedText = 'DELETE';
  const canDelete = confirmationText === expectedText;

  const handleConfirm = async () => {
    if (!canDelete) {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
      setConfirmationText('');
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Expert Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </p>
                <p className="text-sm text-red-700">
                  You are about to permanently delete the expert account for:
                </p>
                <p className="text-sm font-semibold text-red-900">
                  {expertName}
                </p>
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                  <p>Expert ID: {expertId}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="font-mono"
              disabled={isDeleting}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            This will permanently remove:
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Expert profile and account data</li>
              <li>Associated pricing tiers</li>
              <li>Service specializations</li>
              <li>Availability settings</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Expert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDeleteConfirmationModal;