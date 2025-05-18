
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LogoutConfirmationProps {
  userType: 'user' | 'expert' | 'admin';
  redirectDelay?: number; // in seconds
  onManualRedirect?: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  userType,
  redirectDelay = 5,
  onManualRedirect
}) => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Set up countdown and redirection
    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
        setProgress(((redirectDelay - secondsLeft + 1) / redirectDelay) * 100);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Redirect to home page when countdown finishes
      navigate('/');
      if (onManualRedirect) {
        onManualRedirect();
      }
    }
  }, [secondsLeft, navigate, redirectDelay, onManualRedirect]);
  
  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'user': return 'User';
      case 'expert': return 'Expert';
      case 'admin': return 'Administrator';
      default: return 'Account';
    }
  };
  
  const handleGoHome = () => {
    navigate('/');
    if (onManualRedirect) {
      onManualRedirect();
    }
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <LogOut className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Logout Successful</CardTitle>
        <CardDescription>
          You have been successfully logged out of your {getUserTypeDisplay()} account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p>You will be redirected to the homepage in <span className="font-medium">{secondsLeft}</span> seconds</p>
        </div>
        <Progress value={progress} className="h-2" />
        <Button 
          variant="default" 
          className="w-full" 
          onClick={handleGoHome}
        >
          Go to Homepage Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogoutConfirmation;
