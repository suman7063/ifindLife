
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface VerificationScreenProps {
  onBackToLogin: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  onBackToLogin 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-ifind-aqua mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
        </p>
      </div>

      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertDescription>
          If you don't see the email, check your spam folder or try again.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onBackToLogin}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default VerificationScreen;
