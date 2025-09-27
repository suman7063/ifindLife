import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-ifind-offwhite to-white p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg animate-breathe">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-4">
          You're All Set!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Your personalized wellness journey is ready to begin. Connect with experts who understand your needs.
        </p>
        
        <div className="bg-white rounded-xl p-6 border border-border/50 w-full max-w-sm mb-8">
          <h3 className="font-poppins font-semibold text-ifind-charcoal mb-4">
            What's next?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ifind-aqua rounded-full"></div>
              <p className="text-sm text-muted-foreground">Create your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ifind-teal rounded-full"></div>
              <p className="text-sm text-muted-foreground">Browse expert profiles</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ifind-purple rounded-full"></div>
              <p className="text-sm text-muted-foreground">Book your first session</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={() => navigate('/mobile-app/auth/signup')}
          className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6 text-lg font-medium"
        >
          Create Account
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mobile-app/auth/login')}
          className="w-full text-ifind-aqua"
        >
          Sign In Instead
        </Button>
      </div>
    </div>
  );
};