
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Sample data for demonstration
const monthlySessions = [
  { month: 'Jan', sessions: 45 },
  { month: 'Feb', sessions: 52 },
  { month: 'Mar', sessions: 49 },
  { month: 'Apr', sessions: 63 },
  { month: 'May', sessions: 58 },
  { month: 'Jun', sessions: 70 },
  { month: 'Jul', sessions: 77 },
  { month: 'Aug', sessions: 82 },
  { month: 'Sep', sessions: 85 },
  { month: 'Oct', sessions: 94 },
  { month: 'Nov', sessions: 88 },
  { month: 'Dec', sessions: 92 },
];

const expertStats = [
  { name: 'Dr. Smith', sessions: 45, rating: 4.8 },
  { name: 'Dr. Johnson', sessions: 38, rating: 4.7 },
  { name: 'Dr. Williams', sessions: 42, rating: 4.9 },
  { name: 'Dr. Davis', sessions: 30, rating: 4.6 },
  { name: 'Dr. Brown', sessions: 35, rating: 4.5 },
];

const platformUsage = [
  { name: 'Video Call', value: 55 },
  { name: 'Chat', value: 30 },
  { name: 'Voice Call', value: 15 },
];

const AdminAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform performance at a glance</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sessions"
          value="1,248"
          change="+12%"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Experts"
          value="38"
          change="+3"
          isPositive={true}
          isLoading={isLoading}
        />
        <StatCard 
          title="User Satisfaction"
          value="93%"
          change="+2%"
          isPositive={true}
          isLoading={isLoading}
        />
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="platform">Platform Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sessions</CardTitle>
              <CardDescription>
                Number of therapy sessions conducted per month
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#14b8a6" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="experts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Experts</CardTitle>
              <CardDescription>
                Experts with the most completed sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expertStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Method Distribution</CardTitle>
              <CardDescription>
                How users are connecting with experts
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={platformUsage}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#14b8a6" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {change} from last month
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
