
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, TrendingUp, Wifi } from 'lucide-react';

export interface CallAnalyticsData {
  duration: number;
  participants: number;
  averageQuality: 'excellent' | 'good' | 'fair' | 'poor';
  peakParticipants: number;
  networkIssues: number;
  costSavings?: number;
}

interface CallAnalyticsProps {
  data: CallAnalyticsData;
  className?: string;
}

export const CallAnalytics: React.FC<CallAnalyticsProps> = ({ 
  data, 
  className = '' 
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Call Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration</span>
            </div>
            <p className="text-lg font-semibold">{formatDuration(data.duration)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Participants</span>
            </div>
            <p className="text-lg font-semibold">{data.participants}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Quality</span>
            </div>
            <Badge className={getQualityColor(data.averageQuality)}>
              {data.averageQuality}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Issues</span>
            </div>
            <p className="text-lg font-semibold">{data.networkIssues}</p>
          </div>
        </div>

        {data.costSavings && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              Estimated cost savings: <span className="font-semibold">${data.costSavings}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const useCallAnalytics = () => {
  const [analyticsData, setAnalyticsData] = React.useState<CallAnalyticsData>({
    duration: 0,
    participants: 0,
    averageQuality: 'good',
    peakParticipants: 0,
    networkIssues: 0
  });

  const updateAnalytics = React.useCallback((newData: Partial<CallAnalyticsData>) => {
    setAnalyticsData(prev => ({ ...prev, ...newData }));
  }, []);

  const resetAnalytics = React.useCallback(() => {
    setAnalyticsData({
      duration: 0,
      participants: 0,
      averageQuality: 'good',
      peakParticipants: 0,
      networkIssues: 0
    });
  }, []);

  return {
    analyticsData,
    updateAnalytics,
    resetAnalytics
  };
};
