import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartHandshake, ArrowRight } from 'lucide-react';

export const OnboardingWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-ifind-offwhite to-white p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center mb-8 shadow-lg">
          <HeartHandshake className="h-16 w-16 text-white" />
        </div>
        
        <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-4">
          Welcome to iFindLife
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Connect with certified wellness experts for personalized support in your mental health journey
        </p>
        
        <div className="space-y-4 w-full max-w-xs">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-2 h-2 bg-ifind-aqua rounded-full"></div>
            <p className="text-sm text-muted-foreground">One-on-one expert sessions</p>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-2 h-2 bg-ifind-teal rounded-full"></div>
            <p className="text-sm text-muted-foreground">Secure & confidential platform</p>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <div className="w-2 h-2 bg-ifind-purple rounded-full"></div>
            <p className="text-sm text-muted-foreground">24/7 availability</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={() => navigate('/mobile-app/onboarding/personalize')}
          className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6 text-lg font-medium"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mobile-app/auth')}
          className="w-full text-ifind-aqua"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
};