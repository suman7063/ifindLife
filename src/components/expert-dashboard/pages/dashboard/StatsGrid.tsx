
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Calendar, Star } from 'lucide-react';

interface StatItem {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  color: string;
}

const StatsGrid: React.FC = () => {
  const stats: StatItem[] = [
    {
      title: "Total Clients",
      value: "12",
      description: "Active clients",
      icon: Users,
      trend: "+3 from last month",
      color: "text-blue-600"
    },
    {
      title: "This Month's Earnings",
      value: "$2,450.00",
      description: "Current month revenue",
      icon: DollarSign,
      trend: "+18% from last month",
      color: "text-green-600"
    },
    {
      title: "Upcoming Sessions",
      value: "8",
      description: "Next 7 days",
      icon: Calendar,
      trend: "4 today, 4 this week",
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Based on 24 reviews",
      icon: Star,
      trend: "Excellent rating",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
