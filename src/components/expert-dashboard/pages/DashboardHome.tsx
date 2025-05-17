import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MessageSquare, Wallet, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import UpcomingAppointments from '../widgets/UpcomingAppointments';
import RecentEarnings from '../widgets/RecentEarnings';
import StatsOverview from '../widgets/StatsOverview';

const DashboardHome: React.FC = () => {
  const { expertProfile } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingAppointments: 0,
    totalEarnings: 0,
    unreadMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!expertProfile?.id) return;
      
      setIsLoading(true);
      try {
        // Get total unique clients
        const { count: clientsCount } = await supabase
          .from('appointments')
          .select('user_id', { count: 'exact', head: true })
          .eq('expert_id', expertProfile.id)
          .is('canceled_at', null);

        // Get upcoming appointments
        const { count: appointmentsCount } = await supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('expert_id', expertProfile.id)
          .gt('appointment_date', new Date().toISOString().split('T')[0])
          .is('canceled_at', null);

        // Get unread messages
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', expertProfile.id)
          .eq('read', false);

        // Get total earnings
        const { data: earningsData } = await supabase
          .from('user_expert_services')
          .select('amount')
          .eq('expert_id', expertProfile.id)
          .eq('status', 'completed');
          
        const totalEarnings = earningsData?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;

        setStats({
          totalClients: clientsCount || 0,
          upcomingAppointments: appointmentsCount || 0,
          totalEarnings: totalEarnings,
          unreadMessages: messagesCount || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [expertProfile]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <StatsOverview
        stats={[
          {
            title: "Total Clients",
            value: stats.totalClients,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            description: "Unique clients served"
          },
          {
            title: "Upcoming Sessions",
            value: stats.upcomingAppointments,
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
            description: "Scheduled appointments"
          },
          {
            title: "Unread Messages",
            value: stats.unreadMessages,
            icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
            description: "Messages requiring attention"
          },
          {
            title: "Total Earnings",
            value: `$${stats.totalEarnings.toFixed(2)}`,
            icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
            description: "Lifetime earnings"
          }
        ]}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingAppointments 
          appointments={[]} // Pass proper appointments data if available
          isLoading={isLoading}
          expertId={expertProfile?.id} 
          limit={5}
        />
        <RecentEarnings expertId={expertProfile?.id} />
      </div>
    </div>
  );
};

export default DashboardHome;
