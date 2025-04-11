
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

export interface CallAuthMessageProps {
  expertName: string;
  onClose: () => void;
}

const CallAuthMessage: React.FC<CallAuthMessageProps> = ({ expertName, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useUserAuth();
  
  // If user is authenticated or still loading, don't show the login message
  if (isAuthenticated || loading) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to log in or sign up to start a call with {expertName}.
        </AlertDescription>
      </Alert>
      <div className="flex space-x-4">
        <Button 
          onClick={() => navigate('/user-login')}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          Log In / Sign Up
        </Button>
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CallAuthMessage;
