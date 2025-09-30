import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="animate-breathe mb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <img 
            src="/ifindlife-logo.png" 
            alt="iFindLife" 
            className="h-32 w-auto"
          />
        </div>
      </div>
      
      <p className="text-2xl font-lato opacity-90 text-center mb-8 font-light">
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