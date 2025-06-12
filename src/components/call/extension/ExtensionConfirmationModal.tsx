
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Plus, Minus, DollarSign, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ExtensionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extensionMinutes: number, cost: number) => Promise<boolean>;
  expertPrice: number;
  isExtending?: boolean;
}

export const ExtensionConfirmationModal: React.FC<ExtensionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expertPrice,
  isExtending = false
}) => {
  const [extensionMinutes, setExtensionMinutes] = useState(15);
  const [isConfirming, setIsConfirming] = useState(false);

  // Use a default wallet balance for now (this should come from props or context in a real implementation)
  const walletBalance = 1000;
  
  const extensionCost = (extensionMinutes / 60) * expertPrice;
  const hasEnoughBalance = walletBalance >= extensionCost;
  const canDecrease = extensionMinutes > 15;
  const canIncrease = extensionMinutes < 60;

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const handleIncrement = () => {
    if (canIncrease) {
      setExtensionMinutes(prev => prev + 15);
    }
  };

  const handleDecrement = () => {
    if (canDecrease) {
      setExtensionMinutes(prev => prev - 15);
    }
  };

  const handleConfirm = async () => {
    if (!hasEnoughBalance) {
      toast.error('Insufficient wallet balance for extension');
      return;
    }

    setIsConfirming(true);
    try {
      const success = await onConfirm(extensionMinutes, extensionCost);
      if (success) {
        toast.success(`Call extended by ${extensionMinutes} minutes`);
        onClose();
      }
    } catch (error) {
      console.error('Extension failed:', error);
      toast.error('Failed to extend call. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    if (!isConfirming && !isExtending) {
      setExtensionMinutes(15); // Reset to default
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Extend Call Duration</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Extension Time Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Extension Time:</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecrement}
                    disabled={!canDecrease || isConfirming}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-xl font-bold min-w-[80px] text-center">
                    +{extensionMinutes} min
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncrement}
                    disabled={!canIncrease || isConfirming}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Cost Display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Extension Cost:</span>
                  <span className="font-medium">{formatPrice(extensionCost)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Wallet Balance:</span>
                  <span className={`font-medium ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPrice(walletBalance)}
                  </span>
                </div>
                
                {hasEnoughBalance && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Remaining After:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(walletBalance - extensionCost)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insufficient Balance Warning */}
          {!hasEnoughBalance && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Insufficient Balance</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  You need {formatPrice(extensionCost - walletBalance)} more to extend the call by {extensionMinutes} minutes.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isConfirming || isExtending}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={!hasEnoughBalance || isConfirming || isExtending}
              className="flex-1"
            >
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Extending...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Extend for {formatPrice(extensionCost)}
                </>
              )}
            </Button>
          </div>

          {/* Quick Extension Options */}
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((minutes) => (
              <Button
                key={minutes}
                variant={extensionMinutes === minutes ? "default" : "outline"}
                size="sm"
                onClick={() => setExtensionMinutes(minutes)}
                disabled={isConfirming || isExtending}
                className="text-xs"
              >
                +{minutes}m
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionConfirmationModal;
