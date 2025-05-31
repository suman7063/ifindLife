
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

const DashboardMetrics: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: "This Month's Revenue",
      value: "$4,850",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      description: "vs last month"
    },
    {
      title: "Sessions Completed",
      value: "42",
      change: "+8",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
      description: "this month"
    },
    {
      title: "Active Clients",
      value: "28",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      description: "currently engaged"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      description: "out of 5.0"
    },
    {
      title: "Response Time",
      value: "2.3 hrs",
      change: "-0.5 hrs",
      trend: "up",
      icon: Clock,
      color: "text-green-600",
      description: "average response"
    },
    {
      title: "Messages Today",
      value: "12",
      change: "+3",
      trend: "up",
      icon: MessageSquare,
      color: "text-indigo-600",
      description: "new messages"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (trend: string, change: string) => {
    if (trend === 'up') {
      return 'text-green-600';
    } else if (trend === 'down') {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">
                {metric.title}
              </CardDescription>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <CardTitle className={`text-2xl ${metric.color}`}>
                  {metric.value}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend, metric.change)}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </div>
          </CardContent>
          
          {/* Subtle background decoration */}
          <div className={`absolute top-0 right-0 w-20 h-20 opacity-5 ${metric.color}`}>
            <metric.icon className="w-full h-full" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
