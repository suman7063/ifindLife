
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const PerformanceOverviewCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance Overview
        </CardTitle>
        <CardDescription>Track your consultation performance and growth</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <p className="text-sm text-muted-foreground">Client Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">42</div>
            <p className="text-sm text-muted-foreground">Sessions This Month</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">96%</div>
            <p className="text-sm text-muted-foreground">Session Completion Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverviewCard;
