
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Star, Clock, Users, MessageSquare, Calendar, Target } from 'lucide-react';

interface PerformanceAnalyticsProps {
  timeRange: string;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ timeRange }) => {
  const performanceMetrics = [
    {
      metric: 'Client Satisfaction',
      current: 4.8,
      target: 4.9,
      progress: 98,
      trend: '+0.2',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      metric: 'Response Time',
      current: 2.3,
      target: 2.0,
      progress: 85,
      trend: '-0.5 hrs',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      metric: 'Session Completion',
      current: 92,
      target: 95,
      progress: 92,
      trend: '-3%',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      metric: 'Client Retention',
      current: 89,
      target: 90,
      progress: 89,
      trend: '+5%',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const satisfactionTrend = [
    { month: 'Jan', rating: 4.6, responses: 24 },
    { month: 'Feb', rating: 4.7, responses: 28 },
    { month: 'Mar', rating: 4.8, responses: 31 },
    { month: 'Apr', rating: 4.6, responses: 26 },
    { month: 'May', rating: 4.9, responses: 35 },
    { month: 'Jun', rating: 4.8, responses: 38 }
  ];

  const skillsRadar = [
    { skill: 'Communication', score: 95 },
    { skill: 'Empathy', score: 92 },
    { skill: 'Problem Solving', score: 88 },
    { skill: 'Professionalism', score: 96 },
    { skill: 'Punctuality', score: 91 },
    { skill: 'Expertise', score: 94 }
  ];

  return (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm">{metric.metric}</CardDescription>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.current}
                </span>
                <Badge variant="outline" className="text-xs">
                  Target: {metric.target}
                </Badge>
              </div>
              <Progress value={metric.progress} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{metric.progress}% of target</span>
                <span className={metric.trend.includes('+') ? 'text-green-600' : 'text-red-600'}>
                  {metric.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Satisfaction Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Client Satisfaction Trend</CardTitle>
          <CardDescription>Average ratings and response rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[4.0, 5.0]} />
              <Tooltip formatter={(value) => [value, 'Rating']} />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Skills Assessment</CardTitle>
          <CardDescription>Based on client feedback and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {skillsRadar.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <span className="text-sm text-gray-600">{skill.score}/100</span>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
