import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, check if user is logged in and has completed onboarding
      navigate('/mobile-app/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-ifind-aqua via-ifind-teal to-ifind-purple p-8 text-white">
      <div className="animate-breathe mb-8">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-poppins font-bold mb-4 text-center">
        iFindLife
      </h1>
      
      <p className="text-xl font-lato opacity-90 text-center mb-8">
        Your wellness journey starts here
      </p>
      
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};