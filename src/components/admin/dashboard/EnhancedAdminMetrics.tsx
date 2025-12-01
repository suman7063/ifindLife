import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AdminMetrics {
  pending_experts: number;
  approved_experts: number;
  rejected_experts: number;
  total_users: number;
  upcoming_appointments: number;
  completed_sessions: number;
  total_revenue_usd: number;
  pending_tickets: number;
}

export const EnhancedAdminMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Use the admin metrics function we created in the database
      const { data, error } = await supabase.rpc('get_admin_metrics');
      
      if (error) throw error;
      
      setMetrics(data as unknown as AdminMetrics);
      
      // Calculate revenue growth (mock calculation for demo)
      if ((data as unknown as AdminMetrics)?.total_revenue_usd) {
        setRevenueGrowth(12.5); // This would typically be calculated from historical data
      }
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      toast.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, type: 'warning' | 'success' | 'danger') => {
    if (type === 'warning' && value > 0) return 'bg-yellow-500';
    if (type === 'danger' && value > 0) return 'bg-red-500';
    if (type === 'success') return 'bg-green-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load metrics</p>
          <Button onClick={fetchMetrics} className="mt-2">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const metricCards = [
    {
      title: 'Pending Expert Reviews',
      value: metrics.pending_experts,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Awaiting approval',
      urgent: metrics.pending_experts > 5
    },
    {
      title: 'Approved Experts',
      value: metrics.approved_experts,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Active experts'
    },
    {
      title: 'Total Users',
      value: metrics.total_users,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Registered users'
    },
    {
      title: 'Revenue (USD)',
      value: `$${metrics.total_revenue_usd.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `+${revenueGrowth}% this month`,
      growth: revenueGrowth
    },
    {
      title: 'Active Sessions',
      value: metrics.upcoming_appointments,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Scheduled appointments'
    },
    {
      title: 'Completed Sessions',
      value: metrics.completed_sessions,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total completed'
    },
    {
      title: 'Support Tickets',
      value: metrics.pending_tickets,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Pending resolution',
      urgent: metrics.pending_tickets > 3
    },
    {
      title: 'Rejected Applications',
      value: metrics.rejected_experts,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Rejected experts'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all hover:shadow-md ${
                metric.urgent ? 'ring-2 ring-red-200 bg-red-50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      </p>
                      {metric.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                      {metric.growth && (
                        <span className="text-green-600 font-medium ml-1">
                          ↗ {metric.growth}%
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
                {metric.urgent && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col gap-1" variant="outline">
              <UserCheck className="h-5 w-5" />
              <span>Review Experts</span>
              {metrics.pending_experts > 0 && (
                <Badge variant="secondary">{metrics.pending_experts}</Badge>
              )}
            </Button>
            <Button className="h-16 flex flex-col gap-1" variant="outline">
              <AlertCircle className="h-5 w-5" />
              <span>Support Tickets</span>
              {metrics.pending_tickets > 0 && (
                <Badge variant="secondary">{metrics.pending_tickets}</Badge>
              )}
            </Button>
            <Button className="h-16 flex flex-col gap-1" variant="outline">
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};