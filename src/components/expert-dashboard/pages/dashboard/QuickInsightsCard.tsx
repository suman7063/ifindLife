
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';

const QuickInsightsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Insights</CardTitle>
        <CardDescription>Your performance at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Client Retention
            </span>
            <span className="font-medium">92%</span>
          </div>
          <Progress value={92} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Session Completion
            </span>
            <span className="font-medium">96%</span>
          </div>
          <Progress value={96} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Client Satisfaction
            </span>
            <span className="font-medium">4.8/5</span>
          </div>
          <Progress value={96} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Revenue Growth
            </span>
            <span className="font-medium text-green-600">+12.5%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900">This Week's Goal</div>
          <div className="text-xs text-blue-700 mt-1">
            Complete 12 sessions (8/12 completed)
          </div>
          <Progress value={67} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInsightsCard;
