
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Calendar, MessageSquare } from 'lucide-react';

const AdvancedStatsCard: React.FC = () => {
  const stats = [
    {
      label: 'New Clients This Month',
      value: '8',
      change: '+33%',
      trend: 'up'
    },
    {
      label: 'Average Session Duration',
      value: '52 min',
      change: '+5 min',
      trend: 'up'
    },
    {
      label: 'Response Time',
      value: '< 2 hours',
      change: '-30 min',
      trend: 'up'
    },
    {
      label: 'Rebooking Rate',
      value: '85%',
      change: '+7%',
      trend: 'up'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Statistics</CardTitle>
        <CardDescription>Detailed performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">{stat.label}</div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              </div>
              <Badge 
                variant={stat.trend === 'up' ? 'default' : 'secondary'}
                className={stat.trend === 'up' ? 'bg-green-100 text-green-800' : ''}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-full">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">Expert Level: Professional</div>
              <div className="text-sm text-gray-600">Based on your performance metrics</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedStatsCard;
