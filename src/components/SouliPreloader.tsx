import { useEffect, useState } from 'react';
import souliLogo from '@/assets/souli-logo.png';

interface SouliPreloaderProps {
  onLoadingComplete?: () => void;
  minDuration?: number;
}

const SouliPreloader = ({ onLoadingComplete, minDuration = 2000 }: SouliPreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/10 animate-fade-in">
      <div className="text-center space-y-6 animate-scale-in">
        <div className="relative inline-block animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-3xl" />
          <img 
            src={souliLogo} 
            alt="Souli" 
            className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SouliPreloader;
