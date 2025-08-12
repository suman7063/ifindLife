import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  Star, 
  Heart, 
  User, 
  Phone,
  VideoIcon,
  MessageSquare,
  History,
  Bell,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAppointmentToCall } from '@/hooks/useAppointmentToCall';
import { toast } from 'sonner';

interface UserDashboardData {
  profile: any;
  recentAppointments: any[];
  favoriteExperts: any[];
  upcomingAppointments: any[];
  stats: {
    totalSessions: number;
    totalSpent: number;
    averageRating: number;
  };
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiateCallFromAppointment, getAppointmentStatus } = useAppointmentToCall();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Fetch recent appointments
      const { data: recentAppointments } = await supabase
        .from('appointments')
        .select(`
          *,
          expert:experts(name, profile_picture, specialization)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch upcoming appointments
      const { data: upcomingAppointments } = await supabase
        .from('appointments')
        .select(`
          *,
          expert:experts(name, profile_picture, specialization)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'confirmed')
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .limit(3);

      // Fetch favorite experts
      const { data: favoriteExperts } = await supabase
        .from('user_favorites')
        .select(`
          expert:experts(
            id,
            name,
            profile_picture,
            specialization,
            average_rating,
            reviews_count
          )
        `)
        .eq('user_id', user?.id)
        .limit(6);

      // Calculate stats
      const { data: sessions } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      const { data: transactions } = await supabase
        .from('user_transactions')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('type', 'payment');

      const totalSessions = sessions?.length || 0;
      const totalSpent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setData({
        profile,
        recentAppointments: recentAppointments || [],
        favoriteExperts: favoriteExperts?.map(f => f.expert).filter(Boolean) || [],
        upcomingAppointments: upcomingAppointments || [],
        stats: {
          totalSessions,
          totalSpent,
          averageRating: 4.8 // This would come from user reviews
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleJoinCall = async (appointmentId: string, callType: 'video' | 'audio' = 'video') => {
    try {
      const status = await getAppointmentStatus(appointmentId);
      
      if (!status?.canJoin) {
        if (status?.isExpired) {
          toast.error('This appointment has expired');
        } else if (status?.timeUntilJoin > 0) {
          toast.error(`Call will be available in ${Math.ceil(status.timeUntilJoin)} minutes`);
        } else {
          toast.error('Cannot join call at this time');
        }
        return;
      }

      await initiateCallFromAppointment(appointmentId, callType);
    } catch (error) {
      console.error('Error joining call:', error);
      toast.error('Failed to join call');
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load dashboard</p>
            <Button onClick={fetchDashboardData} className="mt-2">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {data.profile?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your wellness journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate('/profile')}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{data.stats.totalSessions}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">${data.stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.stats.averageRating}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(data.stats.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button onClick={() => navigate('/experts')} className="mt-2">
                  Book a Session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={appointment.expert?.profile_picture} />
                        <AvatarFallback>
                          {appointment.expert?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.expert?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.expert?.specialization}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(appointment.appointment_date)} at {formatTime(appointment.start_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleJoinCall(appointment.id, 'video')}
                      >
                        <VideoIcon className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate('/messages')}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Experts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Favorite Experts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.favoriteExperts.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">No favorite experts yet</p>
                <Button onClick={() => navigate('/experts')} className="mt-2">
                  Explore Experts
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data.favoriteExperts.slice(0, 4).map((expert, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/expert/${expert.id}`)}
                  >
                    <div className="text-center">
                      <Avatar className="mx-auto mb-2">
                        <AvatarImage src={expert.profile_picture} />
                        <AvatarFallback>
                          {expert.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{expert.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {expert.specialization}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{expert.average_rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={appointment.expert?.profile_picture} />
                      <AvatarFallback>
                        {appointment.expert?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.expert?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.expert?.specialization}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.appointment_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        appointment.status === 'completed' ? 'default' :
                        appointment.status === 'confirmed' ? 'secondary' :
                        'outline'
                      }
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        Rate Session
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-16 flex flex-col gap-1" 
              variant="outline"
              onClick={() => navigate('/experts')}
            >
              <User className="h-5 w-5" />
              <span>Find Expert</span>
            </Button>
            <Button 
              className="h-16 flex flex-col gap-1" 
              variant="outline"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="h-5 w-5" />
              <span>My Sessions</span>
            </Button>
            <Button 
              className="h-16 flex flex-col gap-1" 
              variant="outline"
              onClick={() => navigate('/programs')}
            >
              <Star className="h-5 w-5" />
              <span>Programs</span>
            </Button>
            <Button 
              className="h-16 flex flex-col gap-1" 
              variant="outline"
              onClick={() => navigate('/support')}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};