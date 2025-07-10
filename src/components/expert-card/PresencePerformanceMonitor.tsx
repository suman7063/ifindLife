import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Users, Zap } from 'lucide-react';

interface PerformanceMetrics {
  activeConnections: number;
  cacheHitRate: number;
  averageResponseTime: number;
  totalExperts: number;
  onlineExperts: number;
  lastUpdate: number;
}

// Global performance tracking
let performanceMetrics: PerformanceMetrics = {
  activeConnections: 0,
  cacheHitRate: 0,
  averageResponseTime: 0,
  totalExperts: 0,
  onlineExperts: 0,
  lastUpdate: Date.now()
};

let listeners: Set<Function> = new Set();

export const updatePerformanceMetrics = (metrics: Partial<PerformanceMetrics>) => {
  performanceMetrics = { ...performanceMetrics, ...metrics, lastUpdate: Date.now() };
  listeners.forEach(listener => listener(performanceMetrics));
};

export const trackCacheHit = () => {
  updatePerformanceMetrics({
    cacheHitRate: Math.min(performanceMetrics.cacheHitRate + 1, 100)
  });
};

export const trackResponseTime = (time: number) => {
  const currentAvg = performanceMetrics.averageResponseTime;
  const newAvg = currentAvg === 0 ? time : (currentAvg + time) / 2;
  updatePerformanceMetrics({
    averageResponseTime: Math.round(newAvg)
  });
};

interface PresencePerformanceMonitorProps {
  expertCount?: number;
  onlineCount?: number;
  className?: string;
  variant?: 'compact' | 'detailed';
}

const PresencePerformanceMonitor: React.FC<PresencePerformanceMonitorProps> = ({
  expertCount = 0,
  onlineCount = 0,
  className = '',
  variant = 'compact'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceMetrics);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    setIsVisible(process.env.NODE_ENV === 'development' || localStorage.getItem('showPerformanceMonitor') === 'true');
    
    const listener = (newMetrics: PerformanceMetrics) => {
      setMetrics(newMetrics);
    };
    
    listeners.add(listener);
    
    // Update with current expert counts
    updatePerformanceMetrics({
      totalExperts: expertCount,
      onlineExperts: onlineCount
    });
    
    return () => {
      listeners.delete(listener);
    };
  }, [expertCount, onlineCount]);

  if (!isVisible) {
    return null;
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600 bg-green-100';
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (variant === 'compact') {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Badge 
          variant="outline" 
          className="bg-background/95 backdrop-blur-sm border shadow-lg"
        >
          <Activity className="h-3 w-3 mr-1" />
          {metrics.onlineExperts}/{metrics.totalExperts} online
          {metrics.averageResponseTime > 0 && (
            <span className="ml-2 text-xs">
              {formatTime(metrics.averageResponseTime)}
            </span>
          )}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Presence System Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-blue-500" />
            <span>Online: {metrics.onlineExperts}/{metrics.totalExperts}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-green-500" />
            <span>Connections: {metrics.activeConnections}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-purple-500" />
            <span>Response: {formatTime(metrics.averageResponseTime)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${
              getPerformanceColor(metrics.cacheHitRate, { good: 80, warning: 60 })
            }`}>
              Cache: {metrics.cacheHitRate}%
            </span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last update: {new Date(metrics.lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresencePerformanceMonitor;