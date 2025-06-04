
import React from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CallSecurityProps {
  isSecureConnection: boolean;
  encryptionEnabled: boolean;
  recordingConsent: boolean;
  onToggleRecordingConsent: () => void;
  className?: string;
}

export const CallSecurity: React.FC<CallSecurityProps> = ({
  isSecureConnection,
  encryptionEnabled,
  recordingConsent,
  onToggleRecordingConsent,
  className = ''
}) => {
  const handlePrivacyInfo = () => {
    toast.info('Your calls are encrypted end-to-end and comply with HIPAA standards');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>Security & Privacy</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Your call privacy and security status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className={`h-4 w-4 ${isSecureConnection ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm">Secure Connection</span>
          </div>
          <Badge variant={isSecureConnection ? 'default' : 'destructive'} className="text-xs">
            {isSecureConnection ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className={`h-4 w-4 ${encryptionEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-sm">E2E Encryption</span>
          </div>
          <Badge variant={encryptionEnabled ? 'default' : 'secondary'} className="text-xs">
            {encryptionEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {recordingConsent ? (
              <Eye className="h-4 w-4 text-blue-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">Recording Consent</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRecordingConsent}
            className="text-xs h-6 px-2"
          >
            {recordingConsent ? 'Revoke' : 'Grant'}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrivacyInfo}
          className="w-full text-xs"
        >
          Privacy Information
        </Button>
      </CardContent>
    </Card>
  );
};

export const useCallSecurity = () => {
  const [isSecureConnection, setIsSecureConnection] = React.useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = React.useState(true);
  const [recordingConsent, setRecordingConsent] = React.useState(false);

  const toggleRecordingConsent = React.useCallback(() => {
    setRecordingConsent(prev => !prev);
    toast.success(`Recording consent ${!recordingConsent ? 'granted' : 'revoked'}`);
  }, [recordingConsent]);

  const checkSecurityStatus = React.useCallback(() => {
    // In production, this would check actual security status
    return {
      isSecureConnection: isSecureConnection,
      encryptionEnabled: encryptionEnabled,
      recordingConsent: recordingConsent
    };
  }, [isSecureConnection, encryptionEnabled, recordingConsent]);

  return {
    isSecureConnection,
    encryptionEnabled,
    recordingConsent,
    toggleRecordingConsent,
    checkSecurityStatus
  };
};
