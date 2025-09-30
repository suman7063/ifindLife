import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, check if user is logged in and has completed onboarding
      navigate('/mobile-app/onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-ifind-grey p-8">
      <div className="animate-fade-in mb-8">
        <img 
          src="/ifindlife-logo-transparent.png" 
          alt="iFindLife" 
          className="h-48 w-auto animate-scale-in"
        />
      </div>
      
      <div className="flex space-x-2 mt-12">
        <div className="w-2 h-2 bg-ifind-aqua rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-ifind-teal rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-ifind-purple rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};