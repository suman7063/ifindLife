
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data for different metrics
  const revenueData = [
    { date: '2024-01-01', revenue: 1200, sessions: 15, clients: 8 },
    { date: '2024-01-02', revenue: 1800, sessions: 22, clients: 12 },
    { date: '2024-01-03', revenue: 1600, sessions: 20, clients: 10 },
    { date: '2024-01-04', revenue: 2200, sessions: 28, clients: 15 },
    { date: '2024-01-05', revenue: 2450, sessions: 32, clients: 18 },
    { date: '2024-01-06', revenue: 2100, sessions: 26, clients: 14 },
    { date: '2024-01-07', revenue: 2800, sessions: 35, clients: 20 }
  ];

  const sessionTypeData = [
    { name: 'Individual Therapy', value: 45, sessions: 45, color: '#3b82f6' },
    { name: 'Group Sessions', value: 25, sessions: 25, color: '#10b981' },
    { name: 'Crisis Support', value: 15, sessions: 15, color: '#f59e0b' },
    { name: 'Consultations', value: 15, sessions: 15, color: '#8b5cf6' }
  ];

  const clientSatisfactionData = [
    { month: 'Jan', satisfaction: 4.2, retention: 85, referrals: 12 },
    { month: 'Feb', satisfaction: 4.5, retention: 88, referrals: 15 },
    { month: 'Mar', satisfaction: 4.3, retention: 82, referrals: 10 },
    { month: 'Apr', satisfaction: 4.7, retention: 92, referrals: 18 },
    { month: 'May', satisfaction: 4.8, retention: 95, referrals: 22 },
    { month: 'Jun', satisfaction: 4.6, retention: 90, referrals: 16 }
  ];

  const performanceRadarData = [
    { subject: 'Client Satisfaction', A: 92, fullMark: 100 },
    { subject: 'Session Quality', A: 88, fullMark: 100 },
    { subject: 'Response Time', A: 95, fullMark: 100 },
    { subject: 'Availability', A: 78, fullMark: 100 },
    { subject: 'Expertise', A: 96, fullMark: 100 },
    { subject: 'Communication', A: 90, fullMark: 100 }
  ];

  const kpiMetrics = [
    {
      title: 'Revenue Growth',
      value: '+24.5%',
      change: '+12.3%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'vs last period'
    },
    {
      title: 'Client Retention',
      value: '92%',
      change: '+5.2%',
      trend: 'up' as const,
      icon: Users,
      description: 'monthly retention'
    },
    {
      title: 'Avg Session Rating',
      value: '4.8',
      change: '+0.3',
      trend: 'up' as const,
      icon: Star,
      description: 'out of 5.0'
    },
    {
      title: 'Response Time',
      value: '1.2h',
      change: '-0.5h',
      trend: 'up' as const,
      icon: Clock,
      description: 'average response'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your practice performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {getTrendIcon(metric.trend)}
                  <span className={getTrendColor(metric.trend)}>
                    {metric.change}
                  </span>
                  <span>{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="sessions">Session Analytics</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Types Distribution</CardTitle>
                <CardDescription>Breakdown by session type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {sessionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sessions`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {sessionTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.sessions}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessions & Client Metrics</CardTitle>
              <CardDescription>Track your session volume and client engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis yAxisId="sessions" orientation="left" />
                  <YAxis yAxisId="clients" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Bar yAxisId="sessions" dataKey="sessions" fill="#3b82f6" name="Sessions" />
                  <Bar yAxisId="clients" dataKey="clients" fill="#10b981" name="Unique Clients" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Satisfaction & Retention</CardTitle>
              <CardDescription>Monitor client satisfaction and retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={clientSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="satisfaction" domain={[1, 5]} />
                  <YAxis yAxisId="retention" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    yAxisId="satisfaction" 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="Satisfaction (1-5)"
                  />
                  <Line 
                    yAxisId="retention" 
                    type="monotone" 
                    dataKey="retention" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Retention %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Track your monthly targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Revenue Target</span>
                      <span className="text-sm text-gray-600">$15,000 / $20,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Target className="h-4 w-4 mr-1" />
                      75% complete
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Session Goal</span>
                      <span className="text-sm text-gray-600">85 / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Activity className="h-4 w-4 mr-1" />
                      85% complete
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">New Client Acquisition</span>
                      <span className="text-sm text-gray-600">12 / 15</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      80% complete
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
