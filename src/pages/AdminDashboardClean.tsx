
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut, 
  UserCheck,
  FileText,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminSession {
  id: string;
  role: string;
  timestamp: string;
}

const AdminDashboardClean: React.FC = () => {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAdminSession = () => {
      try {
        const sessionData = localStorage.getItem('clean_admin_session');
        if (!sessionData) {
          navigate('/admin-login-clean', { replace: true });
          return;
        }

        const session: AdminSession = JSON.parse(sessionData);
        const now = new Date().getTime();
        const sessionTime = new Date(session.timestamp).getTime();
        const maxAge = 8 * 60 * 60 * 1000; // 8 hours

        if (now - sessionTime >= maxAge) {
          localStorage.removeItem('clean_admin_session');
          toast.error('Admin session expired');
          navigate('/admin-login-clean', { replace: true });
          return;
        }

        setAdminSession(session);
      } catch (error) {
        console.error('Error validating admin session:', error);
        localStorage.removeItem('clean_admin_session');
        navigate('/admin-login-clean', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    validateAdminSession();
  }, [navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('clean_admin_session');
      toast.success('Logged out successfully');
      navigate('/admin-login-clean', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return null; // Will redirect in useEffect
  }

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts and profiles',
      icon: Users,
      color: 'bg-blue-500',
      action: () => toast.info('User management coming soon')
    },
    {
      title: 'Expert Approvals',
      description: 'Review and approve expert applications',
      icon: UserCheck,
      color: 'bg-green-500',
      action: () => toast.info('Expert approvals coming soon')
    },
    {
      title: 'Content Management',
      description: 'Manage site content and testimonials',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => toast.info('Content management coming soon')
    },
    {
      title: 'Analytics',
      description: 'View platform analytics and reports',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => toast.info('Analytics coming soon')
    },
    {
      title: 'Support Tickets',
      description: 'Handle user support requests',
      icon: MessageCircle,
      color: 'bg-teal-500',
      action: () => toast.info('Support tickets coming soon')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => toast.info('System settings coming soon')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">iFindLife Administration Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{adminSession.id}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {adminSession.role}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are logged in as an administrator. This is a secure area for managing the iFindLife platform.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={card.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">--</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">--</div>
              <div className="text-sm text-gray-600">Active Experts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">--</div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">--</div>
              <div className="text-sm text-gray-600">Support Tickets</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClean;
