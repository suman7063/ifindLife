
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/auth/OptimizedAuthContext';

/**
 * Authentication performance monitoring dashboard
 * Only shown in development mode
 */
const AuthPerformanceMonitor: React.FC = () => {
  const { cacheStats, performanceStats, invalidateCache, clearPerformanceMetrics } = useOptimizedAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  useEffect(() => {
    setIsVisible(import.meta.env.DEV);
  }, []);

  if (!isVisible) return null;

  const getPerformanceStatus = (avgTime: number) => {
    if (avgTime < 100) return { status: 'excellent', color: 'bg-green-500', label: 'Excellent' };
    if (avgTime < 300) return { status: 'good', color: 'bg-blue-500', label: 'Good' };
    if (avgTime < 1000) return { status: 'fair', color: 'bg-yellow-500', label: 'Fair' };
    return { status: 'poor', color: 'bg-red-500', label: 'Needs Optimization' };
  };

  const performanceStatus = getPerformanceStatus(performanceStats.averageResponseTime);
  const cacheEfficiency = cacheStats.hitRate;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Auth Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Performance Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Avg Response Time</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${performanceStatus.color} text-white`}>
                {performanceStatus.label}
              </Badge>
              <span className="text-sm font-mono">
                {performanceStats.averageResponseTime.toFixed(0)}ms
              </span>
            </div>
          </div>

          {/* Cache Performance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Cache Hit Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={cacheEfficiency > 70 ? 'default' : 'secondary'}>
                {cacheEfficiency.toFixed(1)}%
              </Badge>
              <span className="text-sm font-mono">
                {cacheStats.hits}/{cacheStats.hits + cacheStats.misses}
              </span>
            </div>
          </div>

          {/* Operations Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Total Operations</span>
            </div>
            <span className="text-sm font-mono">{performanceStats.totalOperations}</span>
          </div>

          {/* Slowest Operation */}
          {performanceStats.slowestOperation && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Slowest:</strong> {performanceStats.slowestOperation.name} 
              ({performanceStats.slowestOperation.duration.toFixed(0)}ms)
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => invalidateCache()}
              className="flex-1 text-xs"
            >
              Clear Cache
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={clearPerformanceMetrics}
              className="flex-1 text-xs"
            >
              Reset Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPerformanceMonitor;
