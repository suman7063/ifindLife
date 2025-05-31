
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Award, Clock, Users } from 'lucide-react';

interface StatMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  target?: string;
  progress?: number;
  icon: React.ComponentType<{ className?: string }>;
}

const AdvancedStatsCard: React.FC = () => {
  const metrics: StatMetric[] = [
    {
      label: "Monthly Revenue",
      value: "$4,850",
      change: "+15%",
      trend: "up",
      target: "$5,000",
      progress: 97,
      icon: TrendingUp
    },
    {
      label: "Client Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      target: "4.9/5",
      progress: 96,
      icon: Award
    },
    {
      label: "Session Completion Rate",
      value: "92%",
      change: "-3%",
      trend: "down",
      target: "95%",
      progress: 92,
      icon: Target
    },
    {
      label: "Response Time",
      value: "2.3 hrs",
      change: "-0.5 hrs",
      trend: "up",
      target: "2 hrs",
      progress: 85,
      icon: Clock
    },
    {
      label: "Active Clients",
      value: "42",
      change: "+8",
      trend: "up",
      target: "50",
      progress: 84,
      icon: Users
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Track your key performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{metric.value}</span>
                  {metric.target && (
                    <Badge variant="outline" className="text-xs">
                      Target: {metric.target}
                    </Badge>
                  )}
                </div>
              </div>
              
              {metric.progress && (
                <div className="space-y-1">
                  <Progress value={metric.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress: {metric.progress}%</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={getTrendColor(metric.trend)}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedStatsCard;
