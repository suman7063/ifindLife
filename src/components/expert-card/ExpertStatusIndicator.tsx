import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Circle, 
  Clock, 
  UserMinus, 
  Wifi, 
  WifiOff,
  MessageCircle 
} from 'lucide-react';

interface ExpertStatusIndicatorProps {
  status: 'available' | 'busy' | 'away' | 'offline';
  isOnline: boolean;
  lastActivity?: string;
  awayMessageCount?: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ExpertStatusIndicator: React.FC<ExpertStatusIndicatorProps> = ({
  status,
  isOnline,
  lastActivity,
  awayMessageCount = 0,
  className = '',
  showText = true,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          icon: Circle,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          text: 'Available',
          description: 'Ready to help'
        };
      case 'busy':
        return {
          icon: Clock,
          color: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          text: 'Busy',
          description: 'In a session'
        };
      case 'away':
        return {
          icon: UserMinus,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          text: 'Away',
          description: 'Temporarily away'
        };
      case 'offline':
      default:
        return {
          icon: WifiOff,
          color: 'bg-gray-400',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          text: 'Offline',
          description: lastActivity ? `Last seen ${lastActivity}` : 'Not available'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (!showText) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div className={`${sizeClasses[size]} ${config.color} rounded-full border-2 border-white shadow-sm`} />
        {isOnline && (
          <div className={`absolute -top-0.5 -right-0.5 ${sizeClasses.sm} bg-green-400 rounded-full border border-white`} />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant="outline" 
        className={`${config.bgColor} ${config.textColor} border flex items-center gap-1.5 px-2 py-1`}
      >
        <Icon className={iconSizes[size]} />
        <span className="text-xs font-medium">{config.text}</span>
        {isOnline && status !== 'offline' && (
          <Wifi className="h-3 w-3 text-green-500" />
        )}
        {status === 'away' && awayMessageCount > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span className="text-xs bg-red-500 text-white rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
              {awayMessageCount}
            </span>
          </div>
        )}
      </Badge>
      
      {config.description && (
        <span className="text-xs text-gray-500 hidden sm:inline">
          {config.description}
        </span>
      )}
    </div>
  );
};

export default ExpertStatusIndicator;