
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface VerificationScreenProps {
  onBackToLogin: () => void;
  email?: string;
  userType?: 'user' | 'expert';
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  onBackToLogin,
  email,
  userType = 'user'
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-ifind-aqua mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to {email ? <span className="font-medium">{email}</span> : 'your email address'}. 
          Please check your inbox and click the link to activate your account.
        </p>
        {userType === 'expert' && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-orange-700 text-sm">
              <strong>Note for experts:</strong> After email verification, your account will need admin approval before you can log in.
            </p>
          </div>
        )}
      </div>

      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertDescription>
          <strong>Didn't receive the email?</strong><br />
          • Check your spam/junk folder<br />
          • Make sure you entered the correct email address<br />
          • Wait a few minutes for the email to arrive<br />
          • Contact support if you continue having issues
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
