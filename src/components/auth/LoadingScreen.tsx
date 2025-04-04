
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 border-4 border-t-primary border-primary/30 rounded-full animate-spin mb-4"></div>
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingScreen;
