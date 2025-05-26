
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

const LogoutPage: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logoutType = searchParams.get('type') || 'user';
  
  useEffect(() => {
    // Handle countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  // Determine titles based on logout type
  const getTitle = () => {
    switch (logoutType) {
      case 'admin':
        return 'Admin Logout Successful';
      case 'expert':
        return 'Expert Logout Successful';
      default:
        return 'Logout Successful';
    }
  };
  
  const getMessage = () => {
    switch (logoutType) {
      case 'admin':
        return 'You have been successfully logged out of the admin portal.';
      case 'expert':
        return 'You have been successfully logged out of the expert portal.';
      default:
        return 'You have been successfully logged out of your account.';
    }
  };
  
  return (
    <>
      <NewNavbar />
      
      <Container className="py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>
          
          <p className="text-gray-600 mb-6">
            {getMessage()}
            <br />
            You will be redirected to the homepage in {countdown} seconds.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In Again
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
          </div>
        </Card>
      </Container>
      
      <Footer />
    </>
  );
};

export default LogoutPage;
