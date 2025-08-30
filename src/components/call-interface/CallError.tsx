import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Wifi,
  WifiOff
} from 'lucide-react';

interface CallErrorProps {
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export const CallError: React.FC<CallErrorProps> = ({
  error,
  onRetry,
  onClose
}) => {
  const getErrorIcon = () => {
    if (error?.includes('network') || error?.includes('connection')) {
      return <WifiOff className="h-8 w-8 text-destructive" />;
    }
    return <AlertTriangle className="h-8 w-8 text-destructive" />;
  };

  const getErrorTitle = () => {
    if (error?.includes('network') || error?.includes('connection')) {
      return 'Connection Failed';
    }
    if (error?.includes('payment')) {
      return 'Payment Failed';
    }
    return 'Call Failed';
  };

  const getErrorDescription = () => {
    if (error?.includes('network') || error?.includes('connection')) {
      return 'Please check your internet connection and try again.';
    }
    if (error?.includes('payment')) {
      return 'There was an issue processing your payment. Please try again or use a different payment method.';
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const getSuggestions = () => {
    const suggestions = [];
    
    if (error?.includes('network') || error?.includes('connection')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Try switching to a different network');
      suggestions.push('Close other apps using the internet');
    } else if (error?.includes('payment')) {
      suggestions.push('Check your payment details');
      suggestions.push('Ensure sufficient balance in your account');
      suggestions.push('Try a different payment method');
    } else {
      suggestions.push('Refresh the page and try again');
      suggestions.push('Check your internet connection');
      suggestions.push('Contact support if the issue persists');
    }
    
    return suggestions;
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      {/* Error Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          {getErrorIcon()}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">{getErrorTitle()}</h2>
          <p className="text-muted-foreground">
            {getErrorDescription()}
          </p>
        </div>
      </div>

      {/* Error Details */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>Try These Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {getSuggestions().map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        
        <Button variant="outline" onClick={onClose} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>

      {/* Support Link */}
      <div className="text-center">
        <Button variant="link" className="text-sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
};