
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthRedirectSystem from '@/utils/authRedirectSystem';

interface CallAuthMessageProps {
  expertName: string;
  onClose: () => void;
}

const CallAuthMessage: React.FC<CallAuthMessageProps> = ({ expertName, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Store the current context for post-login redirect
    const currentPath = window.location.pathname + window.location.search;
    
    AuthRedirectSystem.setRedirect({
      returnTo: currentPath,
      action: 'call',
      params: {
        expertName,
        autoOpen: true
      },
      message: `Logging you in to start your call with ${expertName}...`
    });
    
    navigate('/user-login');
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <CardTitle className="text-xl">Login Required</CardTitle>
        <CardDescription>
          You need to login to start a call with {expertName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center pb-2">
        <p className="text-sm text-muted-foreground">
          To ensure a secure and personalized experience, please login to your account before starting a call. 
          You'll be returned here automatically after logging in.
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleLogin}>
          Login to Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CallAuthMessage;
