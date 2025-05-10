
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Calendar, Activity, TrendingUp, CreditCard } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  // Mock data - in a real app, these would come from API calls
  const [stats, setStats] = useState({
    totalUsers: 243,
    totalExperts: 15,
    onlineExperts: 6,
    liveSessions: 3,
    monthlyRevenue: 8750,
    bookedSessions: 28
  });

  // Simulate loading data
  useEffect(() => {
    // Here you would fetch real data from your backend
    // This is just a placeholder
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 243,
        totalExperts: 15,
        onlineExperts: 6,
        liveSessions: 3,
        monthlyRevenue: 8750,
        bookedSessions: 28
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Users
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            +2% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Experts
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalExperts}</div>
          <p className="text-xs text-muted-foreground">
            +3 new this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Online Experts
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.onlineExperts}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.onlineExperts / stats.totalExperts) * 100)}% availability
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Live Sessions
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.liveSessions}</div>
          <p className="text-xs text-muted-foreground">
            Active right now
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Revenue
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Booked Sessions
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bookedSessions}</div>
          <p className="text-xs text-muted-foreground">
            This month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
