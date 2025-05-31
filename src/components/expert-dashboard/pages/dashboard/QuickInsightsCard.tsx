
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Target, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'tip' | 'goal' | 'alert' | 'achievement';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  progress?: number;
  metric?: string;
}

const QuickInsightsCard: React.FC = () => {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'goal',
      title: 'Monthly Revenue Goal',
      description: 'You\'re $150 away from your $5,000 monthly target',
      action: 'View opportunities',
      priority: 'high',
      progress: 97,
      metric: '$4,850 / $5,000'
    },
    {
      id: '2',
      type: 'tip',
      title: 'Peak Hours Optimization',
      description: 'Your busiest hours are 2-5 PM. Consider adding more slots.',
      action: 'Update schedule',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Client Milestone',
      description: 'Congratulations! You\'ve reached 100 total sessions.',
      priority: 'low'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Response Time Alert',
      description: 'Your average response time increased to 3.2 hours.',
      action: 'Check messages',
      priority: 'high'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'goal':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'achievement':
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Insights
        </CardTitle>
        <CardDescription>Personalized recommendations and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 border-l-4 rounded-r-lg ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    
                    {insight.progress && insight.metric && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{insight.metric}</span>
                          <span>{insight.progress}%</span>
                        </div>
                        <Progress value={insight.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
                
                {insight.action && (
                  <Button variant="ghost" size="sm" className="ml-2">
                    {insight.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Last updated: 5 minutes ago</p>
            </div>
            <Button variant="outline" size="sm">
              View All Insights
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInsightsCard;
