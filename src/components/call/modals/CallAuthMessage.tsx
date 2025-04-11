
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CallAuthMessageProps {
  expertName: string;
  onClose: () => void;
}

const CallAuthMessage: React.FC<CallAuthMessageProps> = ({ expertName, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
      <div className="rounded-full bg-amber-100 p-6">
        <Lock className="h-12 w-12 text-amber-500" />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground max-w-md">
          You need to be logged in to start a call with {expertName}. Please log in or create an account to continue.
        </p>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          asChild
        >
          <Link to="/login?redirect=expert">
            Log In / Sign Up
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CallAuthMessage;
