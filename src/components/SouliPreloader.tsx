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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="relative inline-block animate-bounce-smooth">
          <img 
            src={souliLogo} 
            alt="Souli" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SouliPreloader;
