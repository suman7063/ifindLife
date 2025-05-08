
import React from 'react';
import { Button } from '@/components/ui/button';
import { Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CallAuthMessageProps {
  expertName: string;
  onClose: () => void;
}

const CallAuthMessage: React.FC<CallAuthMessageProps> = ({ expertName, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-full mb-4">
        <Unlock className="h-8 w-8 text-amber-500" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
      <p className="text-muted-foreground mb-6">
        You need to sign in or create an account to chat with {expertName}.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button 
          asChild
          className="flex-1"
          variant="default"
        >
          <Link to="/login" onClick={onClose}>Sign In</Link>
        </Button>
        
        <Button 
          asChild
          className="flex-1"
          variant="outline"
        >
          <Link to="/signup" onClick={onClose}>Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default CallAuthMessage;
