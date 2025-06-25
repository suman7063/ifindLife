import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ExtensionConfirmationModal from '../extension/ExtensionConfirmationModal';

interface EnhancedCallTimerProps {
  duration: number;
  selectedDurationMinutes: number;
  extensionMinutes?: number;
  remainingTime?: number;
  isOvertime?: boolean;
  isInWarningPeriod?: boolean;
  onExtendCall?: (minutes: number, cost: number) => Promise<boolean>;
  formatTime: (seconds: number) => string;
  pricePerMinute?: number;
  walletBalance?: number;
  formatPrice?: (price: number) => string;
  className?: string;
}

export const EnhancedCallTimer: React.FC<EnhancedCallTimerProps> = ({
  duration,
  selectedDurationMinutes,
  extensionMinutes = 0,
  remainingTime = 0,
  isOvertime = false,
  isInWarningPeriod = false,
  onExtendCall,
  formatTime,
  pricePerMinute = 1,
  walletBalance = 0,
  formatPrice = (price) => `$${price.toFixed(2)}`,
  className = ''
}) => {
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const totalDurationMinutes = selectedDurationMinutes + extensionMinutes;
  const totalDurationSeconds = totalDurationMinutes * 60;
  
  const getStatusColor = () => {
    if (isOvertime) return 'text-red-600';
    if (isInWarningPeriod) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressPercentage = () => {
    if (isOvertime) return 100;
    return Math.min((duration / totalDurationSeconds) * 100, 100);
  };

  const getProgressBarColor = () => {
    if (isOvertime) return 'bg-red-500';
    if (isInWarningPeriod) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getBadgeVariant = () => {
    if (isOvertime) return 'destructive' as const;
    if (isInWarningPeriod) return 'secondary' as const;
    return 'default' as const;
  };

  const getBadgeText = () => {
    if (isOvertime) return 'Overtime';
    if (isInWarningPeriod) return 'Ending Soon';
    return 'Active';
  };

  const handleExtendCall = async (extensionMinutes: number, cost: number) => {
    if (!onExtendCall) return false;
    
    setIsExtending(true);
    try {
      const success = await onExtendCall(extensionMinutes, cost);
      return success;
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <>
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Timer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Call Duration</span>
              </div>
              <Badge variant={getBadgeVariant()}>
                {getBadgeText()}
              </Badge>
            </div>

            {/* Warning Alert for Last 3 Minutes */}
            {isInWarningPeriod && !isOvertime && (
              <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Call ending in {Math.ceil(remainingTime / 60)} minute{Math.ceil(remainingTime / 60) !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-300">
                    Extend your call to continue the conversation
                  </p>
                </div>
              </div>
            )}

            {/* Overtime Alert */}
            {isOvertime && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Call is in overtime
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300">
                    Additional charges may apply
                  </p>
                </div>
              </div>
            )}

            {/* Time Display */}
            <div className="text-center space-y-2">
              <div className={`text-3xl font-mono font-bold ${getStatusColor()}`}>
                {formatTime(duration)}
              </div>
              
              {!isOvertime && (
                <div className="text-sm text-muted-foreground">
                  {formatTime(remainingTime)} remaining
                </div>
              )}

              {isOvertime && (
                <div className="flex items-center justify-center space-x-1 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    {formatTime(duration - totalDurationSeconds)} overtime
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor()}`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            {/* Session Info */}
            <div className="space-y-1 text-center text-sm text-muted-foreground">
              <div>Original Duration: {selectedDurationMinutes} minutes</div>
              {extensionMinutes > 0 && (
                <div className="text-blue-600">
                  Extensions: +{extensionMinutes} minutes
                </div>
              )}
              <div className="font-medium">
                Total Duration: {totalDurationMinutes} minutes
              </div>
            </div>

            {/* Extend Call Button */}
            {onExtendCall && (isInWarningPeriod || isOvertime) && (
              <Button 
                variant={isInWarningPeriod ? "default" : "outline"}
                size="sm" 
                className="w-full"
                onClick={() => setShowExtensionModal(true)}
                disabled={isExtending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isExtending ? 'Processing...' : 'Extend Call'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extension Modal */}
      <ExtensionConfirmationModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        onConfirm={handleExtendCall}
        expertPrice={pricePerMinute}
        isExtending={isExtending}
      />
    </>
  );
};

export default EnhancedCallTimer;
