import { useCallback, useRef, useState, useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  averageResponseTime: number;
  totalOperations: number;
  slowestOperation: PerformanceMetric | null;
  fastestOperation: PerformanceMetric | null;
  recentMetrics: PerformanceMetric[];
}

/**
 * Authentication performance monitoring hook
 * Tracks and optimizes auth operation performance
 */
export const useAuthPerformance = () => {
  const metricsRef = useRef<PerformanceMetric[]>([]);
  const [stats, setStats] = useState<PerformanceStats>({
    averageResponseTime: 0,
    totalOperations: 0,
    slowestOperation: null,
    fastestOperation: null,
    recentMetrics: []
  });

  // Performance measurement wrapper
  const measurePerformance = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric: PerformanceMetric = {
        name: operationName,
        duration,
        timestamp: Date.now(),
        metadata
      };
      
      // Store metric
      metricsRef.current.push(metric);
      
      // Keep only last 100 metrics to prevent memory leaks
      if (metricsRef.current.length > 100) {
        metricsRef.current = metricsRef.current.slice(-100);
      }
      
      // Log slow operations
      if (duration > 1000) { // More than 1 second
        console.warn(`🐌 Slow auth operation detected: ${operationName} took ${duration.toFixed(2)}ms`, metadata);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`⚠️ Auth operation failed: ${operationName} (${duration.toFixed(2)}ms)`, error);
      throw error;
    }
  }, []);

  // Update stats when metrics change
  useEffect(() => {
    const metrics = metricsRef.current;
    if (metrics.length === 0) return;
    
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    const averageResponseTime = totalDuration / metrics.length;
    
    const sortedByDuration = [...metrics].sort((a, b) => a.duration - b.duration);
    const slowestOperation = sortedByDuration[sortedByDuration.length - 1];
    const fastestOperation = sortedByDuration[0];
    
    setStats({
      averageResponseTime,
      totalOperations: metrics.length,
      slowestOperation,
      fastestOperation,
      recentMetrics: metrics.slice(-10) // Last 10 operations
    });
  }, [metricsRef.current.length]);

  // Get performance insights
  const getInsights = useCallback(() => {
    const metrics = metricsRef.current;
    if (metrics.length < 5) return [];
    
    const insights: string[] = [];
    
    // Check for consistently slow operations
    const recentMetrics = metrics.slice(-10);
    const averageRecent = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
    
    if (averageRecent > 500) {
      insights.push('Recent auth operations are slower than optimal. Consider optimizing network requests.');
    }
    
    // Check for operation frequency
    const operationCounts = metrics.reduce((counts, metric) => {
      counts[metric.name] = (counts[metric.name] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const mostFrequent = Object.entries(operationCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostFrequent && mostFrequent[1] > metrics.length * 0.3) {
      insights.push(`Consider caching results for "${mostFrequent[0]}" operation - it's called frequently.`);
    }
    
    return insights;
  }, []);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    setStats({
      averageResponseTime: 0,
      totalOperations: 0,
      slowestOperation: null,
      fastestOperation: null,
      recentMetrics: []
    });
  }, []);

  return {
    measurePerformance,
    stats,
    getInsights,
    clearMetrics
  };
};
