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
    <div className="relative flex flex-col items-center justify-center h-screen bg-ifind-grey p-8 overflow-hidden">
      {/* Word Cloud Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none">
        <div className="text-ifind-aqua font-bold text-4xl absolute top-20 left-10 animate-float">COMPASSION</div>
        <div className="text-ifind-purple font-bold text-2xl absolute top-32 right-16 animate-float" style={{ animationDelay: '1s' }}>MINDFULNESS</div>
        <div className="text-ifind-teal font-bold text-5xl absolute top-1/3 left-1/4 animate-float" style={{ animationDelay: '2s' }}>WELLNESS</div>
        <div className="text-ifind-aqua font-bold text-3xl absolute bottom-1/3 right-20 animate-float" style={{ animationDelay: '0.5s' }}>HEALING</div>
        <div className="text-ifind-purple font-bold text-2xl absolute bottom-40 left-16 animate-float" style={{ animationDelay: '1.5s' }}>JOURNEY</div>
        <div className="text-ifind-teal font-bold text-4xl absolute top-1/2 right-12 animate-float" style={{ animationDelay: '2.5s' }}>BALANCE</div>
        <div className="text-ifind-aqua font-bold text-3xl absolute bottom-24 right-1/4 animate-float" style={{ animationDelay: '3s' }}>RESILIENCE</div>
        <div className="text-ifind-purple font-bold text-2xl absolute top-40 left-1/3 animate-float" style={{ animationDelay: '0.8s' }}>GROWTH</div>
        <div className="text-ifind-teal font-bold text-3xl absolute bottom-1/2 left-12 animate-float" style={{ animationDelay: '1.8s' }}>HARMONY</div>
      </div>

      {/* Logo */}
      <div className="relative z-10 animate-fade-in mb-8">
        <img 
          src="/ifindlife-logo-transparent.png" 
          alt="iFindLife" 
          className="h-40 w-auto object-contain animate-scale-in"
        />
      </div>
      
      {/* Loading Dots */}
      <div className="relative z-10 flex space-x-2 mt-12">
        <div className="w-2 h-2 bg-ifind-aqua rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-ifind-teal rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 bg-ifind-purple rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};