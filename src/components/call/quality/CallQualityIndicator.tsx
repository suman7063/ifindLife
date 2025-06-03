
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type CallQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';

interface CallQualityIndicatorProps {
  quality: CallQuality;
  className?: string;
}

export const CallQualityIndicator: React.FC<CallQualityIndicatorProps> = ({ 
  quality, 
  className = '' 
}) => {
  const getQualityConfig = (quality: CallQuality) => {
    switch (quality) {
      case 'excellent':
        return {
          icon: <Signal className="h-4 w-4" />,
          label: 'Excellent',
          color: 'bg-green-500',
          textColor: 'text-green-700'
        };
      case 'good':
        return {
          icon: <Signal className="h-4 w-4" />,
          label: 'Good',
          color: 'bg-blue-500',
          textColor: 'text-blue-700'
        };
      case 'fair':
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Fair',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700'
        };
      case 'poor':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Poor',
          color: 'bg-orange-500',
          textColor: 'text-orange-700'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          label: 'Disconnected',
          color: 'bg-red-500',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <Signal className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-500',
          textColor: 'text-gray-700'
        };
    }
  };

  const config = getQualityConfig(quality);

  return (
    <Badge variant="outline" className={`${className} ${config.textColor}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  );
};

export const useCallQuality = () => {
  const [quality, setQuality] = useState<CallQuality>('good');
  const [networkStats, setNetworkStats] = useState({
    latency: 0,
    packetLoss: 0,
    bandwidth: 0
  });

  // Simulate network quality monitoring
  useEffect(() => {
    const checkQuality = () => {
      // In a real implementation, you would use Agora's network quality APIs
      const randomLatency = Math.random() * 200;
      const randomPacketLoss = Math.random() * 5;
      const randomBandwidth = Math.random() * 1000;

      setNetworkStats({
        latency: randomLatency,
        packetLoss: randomPacketLoss,
        bandwidth: randomBandwidth
      });

      // Determine quality based on network stats
      if (randomLatency < 50 && randomPacketLoss < 1) {
        setQuality('excellent');
      } else if (randomLatency < 100 && randomPacketLoss < 2) {
        setQuality('good');
      } else if (randomLatency < 150 && randomPacketLoss < 3) {
        setQuality('fair');
      } else if (randomLatency < 200 && randomPacketLoss < 5) {
        setQuality('poor');
      } else {
        setQuality('disconnected');
      }
    };

    const interval = setInterval(checkQuality, 5000);
    checkQuality(); // Initial check

    return () => clearInterval(interval);
  }, []);

  return {
    quality,
    networkStats,
    setQuality
  };
};
