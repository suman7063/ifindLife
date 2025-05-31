
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const AnalyticsCard: React.FC = () => {
  const metrics: AnalyticsMetric[] = [
    {
      title: "Total Sessions",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Calendar
    },
    {
      title: "Active Clients",
      value: "42",
      change: "+8%",
      trend: "up",
      icon: Users
    },
    {
      title: "Monthly Revenue",
      value: "$4,850",
      change: "+15%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Avg Session Duration",
      value: "52 min",
      change: "-3%",
      trend: "down",
      icon: Clock
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
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Your key metrics for this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-8 w-8 text-blue-500" />
                {getTrendIcon(metric.trend)}
              </div>
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {metric.change} from last month
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
